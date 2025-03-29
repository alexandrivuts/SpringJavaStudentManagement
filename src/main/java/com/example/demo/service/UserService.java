package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Метод для получения всех пользователей
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Метод для получения пользователя по ID
    public Optional<User> getUserById(int userId) {
        return userRepository.findById(userId);
    }

    // Метод для добавления нового пользователя
    public User addUser(User user) {
        return userRepository.save(user);
    }

    // Метод для обновления пользователя
    public User updateUser(int userId, User updatedUser) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setUsername(updatedUser.getUsername());
            user.setPassword(updatedUser.getPassword());
            user.setEmail(updatedUser.getEmail());
            // Здесь можно добавить обновление других полей, если нужно
            return userRepository.save(user);
        } else {
            // Можно выбросить исключение, если пользователь не найден
            throw new RuntimeException("User not found");
        }
    }

    // Метод для удаления пользователя
    public void deleteUser(int userId) {
        userRepository.deleteById(userId);
    }

    // Метод для поиска пользователя по username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
