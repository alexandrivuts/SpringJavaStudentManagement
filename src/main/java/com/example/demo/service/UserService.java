package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;  // Используем PasswordEncoder
    private final RoleService roleService;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Добавляем логирование для отладки
        System.out.println("[DEBUG] Attempting to load user: " + username);

        // 2. Ищем пользователя
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("[ERROR] User not found: " + username);
                    return new UsernameNotFoundException("Invalid credentials");
                });

        // 3. Проверяем важные поля
        if (user.getPassword() == null) {
            System.out.println("[ERROR] No password set for user: " + username);
            throw new UsernameNotFoundException("User password not set");
        }

        if (user.getRole() == null) {
            System.out.println("[WARN] No roles assigned to user: " + username);
        }

        // 4. Создаем UserDetails с проверкой статуса
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .disabled(false) // Активируем аккаунт
                .accountExpired(false)
                .credentialsExpired(false)
                .accountLocked(false)
                .authorities(
                        user.getRole() != null ?
                                Collections.singleton(new SimpleGrantedAuthority(user.getRole().getRoleName())) :
                                Collections.emptyList()
                )
                .build();
    }

    // Регистрация нового пользователя
    public void insert(User user) {
        if (isUsernameExists(user.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        // Хешируем пароль перед сохранением
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // Присваиваем роль по умолчанию, если роль не указана
        if (user.getRole() == null) {
            user.setRole(roleService.getDefaultRole());  // Используем роль по умолчанию, например, 'USER'
        }

        userRepository.save(user);
    }

    public void update(User user) {
        if (isUserValid(user)) {
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Invalid user data.");
        }
    }

    public void delete(int userId) {
        User user = findById(userId);
        userRepository.delete(user);
    }

    public User findById(int userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User with username " + username + " not found."));
    }

    public boolean isUsernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public User login(String username, String password) {
        User user = findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    private boolean isUserValid(User user) {
        return user.getUsername() != null && !user.getUsername().isEmpty() &&
                user.getPassword() != null && !user.getPassword().isEmpty() &&
                user.getName() != null && !user.getName().isEmpty() &&
                user.getSurname() != null && !user.getSurname().isEmpty() &&
                user.getEmail() != null && !user.getEmail().isEmpty() &&
                user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty() &&
                user.getBirthday() != null && !user.getBirthday().isEmpty();
    }
}
