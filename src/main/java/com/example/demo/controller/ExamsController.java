package com.example.demo.controller;

import com.example.demo.dto.TranscriptDto;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exams")
public class ExamsController {

    private final StudentService studentService;

    public ExamsController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Получение зачетки студента
    @GetMapping("/transcript")
    public ResponseEntity<Map<String, Object>> getMyTranscript(Authentication auth) {
        String username = auth.getName();
        Student student = studentService.findByUsername(username);

        // Получаем зачетку студента
        TranscriptDto transcript = studentService.getTranscript(student.getStudent_id());

        // Преобразуем зачетку в нужный формат
        Map<String, Object> response = new HashMap<>();
        response.put("courseName", transcript.getCourseName());
        response.put("exams", transcript.getExams().stream()
                .map(examDto -> {
                    Map<String, Object> examResponse = new HashMap<>();
                    examResponse.put("subject", examDto.getSubject());
                    examResponse.put("grade", examDto.getGrade());
                    return examResponse;
                })
                .collect(Collectors.toList()));

        return ResponseEntity.ok(response);
    }
}
