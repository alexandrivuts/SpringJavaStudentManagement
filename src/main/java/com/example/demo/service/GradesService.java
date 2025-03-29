package com.example.demo.service;

import com.example.demo.model.Grades;
import com.example.demo.model.Student;
import com.example.demo.model.Exams;
import com.example.demo.repository.GradesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradesService {

    private final GradesRepository gradesRepository;

    @Autowired
    public GradesService(GradesRepository gradesRepository) {
        this.gradesRepository = gradesRepository;
    }

    public void insert(Grades grade) {
        if (isGradeValid(grade)) {
            gradesRepository.save(grade);
        } else {
            throw new IllegalArgumentException("Invalid grade or associated student/exam.");
        }
    }

    public void update(Grades grade) {
        if (isGradeValid(grade)) {
            gradesRepository.save(grade);
        } else {
            throw new IllegalArgumentException("Invalid grade or associated student/exam.");
        }
    }

    public void delete(int gradeId) {
        if (!gradesRepository.existsById(gradeId)) {
            throw new IllegalArgumentException("Grade not found for deletion.");
        }
        gradesRepository.deleteById(gradeId);
    }

    public Grades findById(int gradeId) {
        return gradesRepository.findById(gradeId)
                .orElseThrow(() -> new IllegalArgumentException("Grade not found."));
    }

    public List<Grades> findAll() {
        List<Grades> grades = gradesRepository.findAll();
        if (grades.isEmpty()) {
            throw new IllegalStateException("No grades found.");
        }
        return grades;
    }

    public List<Grades> findByStudentId(int studentId) {
        List<Grades> grades = gradesRepository.findByStudent_studentId(studentId);
        if (grades.isEmpty()) {
            throw new IllegalStateException("No grades found for student with ID: " + studentId);
        }
        return grades;
    }

    public List<Grades> findByExams_id(int examId) {
        List<Grades> grades = gradesRepository.findByExams_ExamId(examId);
        if (grades.isEmpty()) {
            throw new IllegalStateException("No grades found for exam with ID: " + examId);
        }
        return grades;
    }

    public Grades findByStudentAndExam(int studentId, int examId) {
        Student student = new Student();
        student.setStudent_id(studentId);

        Exams exam = new Exams();
        exam.setExam_id(examId);

        return gradesRepository.findByStudentAndExams(student, exam);
    }

    private boolean isGradeValid(Grades grade) {
        return grade.getStudent() != null && grade.getExams() != null && grade.getGrade() >= 0;
    }

    public boolean gradeExists(int studentId, int examId) {
        Student student = new Student();
        student.setStudent_id(studentId);

        Exams exam = new Exams();
        exam.setExam_id(examId);

        return gradesRepository.existsByStudentAndExams(student, exam);
    }
}
