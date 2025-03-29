package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Можно добавить кастомные запросы, если нужно
    User findByUsername(String username);  // Пример кастомного метода для поиска по username
}
