package com.example.demo.repository;

import com.example.demo.model.ScholarshipAmount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScholarshipAmountRepository extends JpaRepository<ScholarshipAmount, Integer> {
    // Можно добавить кастомные запросы, если нужно
}
