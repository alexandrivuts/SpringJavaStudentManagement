package com.example.demo.repository;

import com.example.demo.model.Exams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamsRepository extends JpaRepository<Exams, Integer> {
    // Можно добавить кастомные запросы, если нужно
}
