package com.example.demo.repository;

import com.example.demo.model.Grades;
import com.example.demo.model.Student;
import com.example.demo.model.Exams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradesRepository extends JpaRepository<Grades, Integer> {
    List<Grades> findByStudent_studentId(int studentId);
    List<Grades> findByExams_ExamId(int examId);
    Grades findByStudentAndExams(Student student, Exams exam);
    boolean existsByStudentAndExams(Student student, Exams exam);
}
