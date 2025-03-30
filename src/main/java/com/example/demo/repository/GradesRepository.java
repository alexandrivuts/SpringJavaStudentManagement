package com.example.demo.repository;

import com.example.demo.model.Grades;
import com.example.demo.model.Student;
import com.example.demo.model.Exams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradesRepository extends JpaRepository<Grades, Integer> {

    // Найти все оценки студента по его ID
    List<Grades> findByStudent_studentId(int studentId);

    // Найти все оценки по экзамену по его ID
    List<Grades> findByExams_ExamId(int examId);

    // Найти оценку по студенту и экзамену
    Grades findByStudentAndExams(Student student, Exams exam);

    // Проверить, существует ли оценка для данного студента и экзамена
    boolean existsByStudentAndExams(Student student, Exams exam);

    // Найти или создать новую запись для оценки
    default Grades findOrCreateGrade(Student student, Exams exam) {
        return findByStudentAndExams(student, exam) != null ? findByStudentAndExams(student, exam) : new Grades(student, exam);
    }
}
