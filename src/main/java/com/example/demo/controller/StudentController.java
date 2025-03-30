package com.example.demo.controller;

import com.example.demo.dto.StudentProfileDto;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // 1. Просмотр профиля студента
    @GetMapping("/me/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getMyProfile(Authentication auth) {
        String username = auth.getName();
        Student student = studentService.findByUsername(username);
        Map<String, Object> response = new HashMap<>();
        response.put("name", student.getUser().getName());
        response.put("surname", student.getUser().getSurname());
        response.put("email", student.getUser().getEmail());
        response.put("phoneNumber", student.getUser().getPhoneNumber());
        response.put("birthday", student.getUser().getBirthday());
        response.put("averageGrade", studentService.calculateAverageGrade(student.getStudent_id()));

        if (student.getGroup() != null) {
            response.put("groupNumber", student.getGroup().getGroupNumber());
            response.put("course", student.getGroup().getCourse());
            response.put("faculty", student.getGroup().getFaculty());
            response.put("specialization", student.getGroup().getSpecialization());
        }

        return ResponseEntity.ok(response);
    }
}