package com.example.demo.service;

import com.example.demo.model.Exams;
import com.example.demo.repository.ExamsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamsService {

    @Autowired
    private ExamsRepository examsRepository;

    // Метод для получения всех экзаменов
    public List<Exams> getAllExams() {
        return examsRepository.findAll();
    }

    // Метод для получения экзамена по ID
    public Optional<Exams> getExamById(int examId) {
        return examsRepository.findById(examId);
    }

    // Метод для добавления нового экзамена
    public Exams addExam(Exams exam) {
        return examsRepository.save(exam);
    }

    // Метод для обновления экзамена
    public Exams updateExam(int examId, Exams updatedExam) {
        Optional<Exams> existingExam = examsRepository.findById(examId);
        if (existingExam.isPresent()) {
            Exams exam = existingExam.get();
            exam.setSubject(updatedExam.getSubject());
            exam.setCourse(updatedExam.getCourse());
            return examsRepository.save(exam);
        } else {
            // Можно выбросить исключение, если запись не найдена
            throw new RuntimeException("Exam not found");
        }
    }

    // Метод для удаления экзамена
    public void deleteExam(int examId) {
        examsRepository.deleteById(examId);
    }
}
