package com.example.demo.service;

import com.example.demo.model.Grades;
import com.example.demo.repository.GradesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GradesService {

    @Autowired
    private GradesRepository gradesRepository;

    // Метод для получения всех оценок
    public List<Grades> getAllGrades() {
        return gradesRepository.findAll();
    }

    // Метод для получения оценки по ID
    public Optional<Grades> getGradeById(int gradeId) {
        return gradesRepository.findById(gradeId);
    }

    // Метод для добавления новой оценки
    public Grades addGrade(Grades grade) {
        return gradesRepository.save(grade);
    }

    // Метод для обновления оценки
    public Grades updateGrade(int gradeId, Grades updatedGrade) {
        Optional<Grades> existingGrade = gradesRepository.findById(gradeId);
        if (existingGrade.isPresent()) {
            Grades grade = existingGrade.get();
            grade.setGrade(updatedGrade.getGrade());
            grade.setStudent(updatedGrade.getStudent());
            grade.setExams(updatedGrade.getExams());
            return gradesRepository.save(grade);
        } else {
            // Можно выбросить исключение, если запись не найдена
            throw new RuntimeException("Grade not found");
        }
    }

    // Метод для удаления оценки
    public void deleteGrade(int gradeId) {
        gradesRepository.deleteById(gradeId);
    }
}
