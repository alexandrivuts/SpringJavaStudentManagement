package com.example.demo.repository;

import com.example.demo.model.Exams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamsRepository extends JpaRepository<Exams, Integer> {
    List<Exams> findByCourse(int course);
}
