package com.example.demo.controller;

import com.example.demo.dto.StudentProfileDto;
import com.example.demo.dto.TranscriptDto;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // 1. Просмотр профиля студента
    @GetMapping("/profile")
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

    // 2. Просмотр всех студентов (доступно для всех ролей)
    @GetMapping("/all")
    public ResponseEntity<List<StudentProfileDto>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        List<StudentProfileDto> studentDtos = students.stream()
                .map(student -> {
                    StudentProfileDto dto = new StudentProfileDto();
                    dto.setName(student.getUser().getName());
                    dto.setSurname(student.getUser().getSurname());
                    dto.setEmail(student.getUser().getEmail());
                    dto.setPhoneNumber(student.getUser().getPhoneNumber());
                    dto.setBirthday(student.getUser().getBirthday());
                    dto.setAverageGrade(studentService.calculateAverageGrade(student.getStudent_id()));
                    if (student.getGroup() != null) {
                        dto.setGroupNumber(student.getGroup().getGroupNumber());
                        dto.setCourse(student.getGroup().getCourse());
                        dto.setFaculty(student.getGroup().getFaculty());
                        dto.setSpecialization(student.getGroup().getSpecialization());
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(studentDtos);
    }

    // Поиск студентов по имени и фамилии
    @GetMapping("/search")
    public ResponseEntity<List<StudentProfileDto>> searchStudents(
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName) {

        List<Student> students = studentService.findStudentsByFullName(firstName, lastName);
        List<StudentProfileDto> studentDtos = students.stream()
                .map(student -> {
                    StudentProfileDto dto = new StudentProfileDto();
                    dto.setName(student.getUser().getName());
                    dto.setSurname(student.getUser().getSurname());
                    dto.setEmail(student.getUser().getEmail());
                    dto.setPhoneNumber(student.getUser().getPhoneNumber());
                    dto.setBirthday(student.getUser().getBirthday());
                    dto.setAverageGrade(studentService.calculateAverageGrade(student.getStudent_id()));
                    if (student.getGroup() != null) {
                        dto.setGroupNumber(student.getGroup().getGroupNumber());
                        dto.setCourse(student.getGroup().getCourse());
                        dto.setFaculty(student.getGroup().getFaculty());
                        dto.setSpecialization(student.getGroup().getSpecialization());
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(studentDtos);
    }
}