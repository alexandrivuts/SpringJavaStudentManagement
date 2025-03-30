package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/grades")
public class GradesController {

    private final StudentService studentService;

    public GradesController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Получение среднего балла и суммы стипендии студента
    @GetMapping("/scholarship")
    public ResponseEntity<Map<String, Object>> getAverageGradeAndScholarship(Authentication auth) {
        String username = auth.getName();
        Student student = studentService.findByUsername(username);

        // Получаем средний балл студента
        double averageGrade = studentService.calculateAverageGrade(student.getStudent_id());

        // Получаем сумму стипендии на основе среднего балла
        BigDecimal scholarshipAmount = studentService.calculateScholarshipAmount(student.getStudent_id());

        // Возвращаем средний балл и сумму стипендии
        Map<String, Object> response = new HashMap<>();
        response.put("averageGrade", averageGrade);
        response.put("scholarshipAmount", scholarshipAmount);

        return ResponseEntity.ok(response);
    }
}
