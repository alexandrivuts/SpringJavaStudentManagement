package com.example.demo.repository;

import com.example.demo.model.Exams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamsRepository extends JpaRepository<Exams, Integer> {
    Optional<Exams> findBySubject(String subject);
    List<Exams> findByCourse(int course);

    @Query("SELECT e FROM Exams e WHERE e.course = :course AND e.subject LIKE %:keyword%")
    List<Exams> findByCourseAndSubjectContaining(int course, String keyword);

    List<Exams> findBySubjectStartingWith(String prefix);
}