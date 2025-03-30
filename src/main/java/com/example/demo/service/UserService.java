package com.example.demo.service;

import com.example.demo.model.Group;
import com.example.demo.model.Student;
import com.example.demo.model.User;
import com.example.demo.repository.GroupRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class UserService implements UserDetailsService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       RoleService roleService,
                       StudentRepository studentRepository,
                       GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("[AUTH] Loading user: " + username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("[AUTH ERROR] User not found: " + username);
                    return new UsernameNotFoundException("User not found");
                });

        if (user.getPassword() == null) {
            System.out.println("[AUTH ERROR] No password for user: " + username);
            throw new UsernameNotFoundException("Invalid credentials");
        }

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "ROLE_USER";
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName.toUpperCase();
        }

        System.out.println("[AUTH] User: " + user.getUsername() + " Role: " + roleName);

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .disabled(false)
                .accountExpired(false)
                .credentialsExpired(false)
                .accountLocked(false)
                .authorities(Collections.singleton(new SimpleGrantedAuthority(roleName)))
                .build();
    }

    public void insert(User user, int groupNumber) {
        validateUser(user);
        checkUsernameAvailability(user.getUsername());

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(roleService.getDefaultRole());

        User savedUser = userRepository.save(user);
        createStudentRecord(savedUser, groupNumber);
    }

    private void validateUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
                user.getPassword() == null || user.getPassword().trim().isEmpty() ||
                user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Required fields are missing");
        }
    }

    private void checkUsernameAvailability(String username) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
    }

    private void createStudentRecord(User user, int groupNumber) {
        Group group = groupRepository.findByGroupNumber(groupNumber);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        Student student = new Student();
        student.setUser(user);
        student.setGroup(group);
        studentRepository.save(student);
    }

    public void update(User user) {
        validateUser(user);
        if (!userRepository.existsById(user.getUser_id())) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.save(user);
    }

    public void delete(int userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(userId);
    }

    public User findById(int userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public boolean isUsernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}
