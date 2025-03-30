package com.example.demo.controller;

import com.example.demo.service.StudentService;
import com.example.demo.model.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class GroupController {

    private final StudentService studentService;

    public GroupController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Получение всех студентов по группам
    @GetMapping("/group")
    public ResponseEntity<List<Student>> getAllStudentsByGroup() {
        List<Student> studentsByGroup = studentService.getAllStudents(); // - пока не по группам
        // Возвращаем всех студентов, разбитых по группам
        return ResponseEntity.ok(studentsByGroup);
    }
}
