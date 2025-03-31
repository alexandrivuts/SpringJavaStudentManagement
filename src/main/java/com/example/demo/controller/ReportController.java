package com.example.demo.controller;

import com.example.demo.dto.ScholarshipReportDto;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final StudentService studentService;

    // Добавляем конструктор с внедрением зависимости
    public ReportController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/scholarship")
    public ResponseEntity<List<ScholarshipReportDto>> getScholarshipReport() {
        return ResponseEntity.ok(studentService.generateScholarshipReport());
    }
}