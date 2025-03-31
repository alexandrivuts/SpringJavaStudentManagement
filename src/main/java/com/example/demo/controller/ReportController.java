package com.example.demo.controller;

import com.example.demo.dto.ScholarshipReportDto;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final StudentService studentService;

    public ReportController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PreAuthorize("hasRole('ROLE_ACCOUNTANT')")
    @GetMapping("/scholarship")
    public ResponseEntity<List<ScholarshipReportDto>> getScholarshipReport() {
        return ResponseEntity.ok(studentService.generateScholarshipReport());
    }
}