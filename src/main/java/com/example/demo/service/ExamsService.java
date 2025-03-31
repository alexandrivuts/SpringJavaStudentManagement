package com.example.demo.service;

import com.example.demo.model.Exams;
import com.example.demo.repository.ExamsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamsService {

    private final ExamsRepository examsRepository;

    @Autowired
    public ExamsService(ExamsRepository examsRepository) {
        this.examsRepository = examsRepository;
    }

    public void insert(Exams exam) {
        if (isExamValid(exam)) {
            examsRepository.save(exam);
        } else {
            throw new IllegalArgumentException("Invalid exam data.");
        }
    }

    public void update(Exams exam) {
        if (isExamValid(exam)) {
            examsRepository.save(exam);
        } else {
            throw new IllegalArgumentException("Invalid exam data.");
        }
    }

    public void delete(int ExamId) {
        if (!examsRepository.existsById(ExamId)) {
            throw new IllegalArgumentException("Exam not found for deletion.");
        }
        examsRepository.deleteById(ExamId);
    }

    public Exams findById(int ExamId) {
        return examsRepository.findById(ExamId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found."));
    }

    public List<Exams> findAll() {
        List<Exams> exams = examsRepository.findAll();
        if (exams.isEmpty()) {
            throw new IllegalStateException("No exams found.");
        }
        return exams;
    }
    public List<Exams> getAllExams() {
        return examsRepository.findAll();
    }
    public List<Exams> findByCourse(int course) {
        List<Exams> exams = examsRepository.findByCourse(course);
        if (exams.isEmpty()) {
            throw new IllegalStateException("No exams found for course: " + course);
        }
        return exams;
    }

    private boolean isExamValid(Exams exam) {
        return exam.getSubject() != null && !exam.getSubject().isEmpty() && exam.getCourse() > 0;
    }

}
