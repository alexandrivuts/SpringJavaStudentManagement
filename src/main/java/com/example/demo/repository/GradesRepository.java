package com.example.demo.repository;

import com.example.demo.model.Exams;
import com.example.demo.model.Grades;
import com.example.demo.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradesRepository extends JpaRepository<Grades, Integer> {
    List<Grades> findByStudent(Student student);
    List<Grades> findByExam(Exams exam);

    @Query("SELECT AVG(g.grade) FROM Grades g WHERE g.student = :student")
    Float calculateAverageByStudent(Student student);

    @Query("SELECT g FROM Grades g WHERE g.student = :student AND g.grade < :passingGrade")
    List<Grades> findFailedGrades(Student student, Float passingGrade);

    List<Grades> findByGradeBetween(Float minGrade, Float maxGrade);
}