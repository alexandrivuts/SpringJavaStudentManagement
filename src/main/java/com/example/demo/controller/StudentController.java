package com.example.demo.controller;

import com.example.demo.dto.StudentProfileDto;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/me/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentProfileDto getMyProfile(Authentication authentication) {
        // Получаем student_id из аутентифицированного пользователя
        String username = authentication.getName();
        Student student = studentService.findByUsername(username);

        StudentProfileDto dto = new StudentProfileDto();
        dto.setName(student.getName());
        dto.setSurname(student.getLastname());
        dto.setEmail(student.getEmail());

        if (student.getGroup() != null) {
            dto.setGroupNumber(student.getGroup().getGroupNumber());
            dto.setCourse(student.getGroup().getCourse());
            dto.setFaculty(student.getGroup().getFaculty());
            dto.setSpecialization(student.getGroup().getSpecialization());
        }

        dto.setAverageGrade(studentService.calculateAverageGrade(student.getStudent_id()));
        return dto;
    }
}