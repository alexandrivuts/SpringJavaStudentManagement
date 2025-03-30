package com.example.demo.controller;

import com.example.demo.dto.ExamDto;
import com.example.demo.dto.TranscriptDto;
import com.example.demo.model.Exams;
import com.example.demo.model.Student;
import com.example.demo.service.ExamsService;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exams")
public class ExamsController {
    private final StudentService studentService;
    private final ExamsService examsService;  // Сервис для работы с экзаменами

    public ExamsController(StudentService studentService, ExamsService examsService) {
        this.studentService = studentService;
        this.examsService = examsService;
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

    // Получение всех экзаменов (только для ADMIN и ACCOUNTANT)
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_ACCOUNTANT')")
    @GetMapping("/all")
    public ResponseEntity<List<ExamDto>> getAllExams() {
        // Получаем все экзамены из сервиса
        List<Exams> exams = examsService.getAllExams();

        // Преобразуем список экзаменов в список DTO
        List<ExamDto> examDtos = exams.stream()
                .map(exam -> {
                    ExamDto dto = new ExamDto();
                    dto.setSubject(exam.getSubject());
                    dto.setCourse(exam.getCourse());
                    return dto;
                })
                .collect(Collectors.toList());

        // Возвращаем список экзаменов в формате DTO
        return ResponseEntity.ok(examDtos);
    }

    // Изменение предмета (только для ADMIN)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/update/{examId}")
    public ResponseEntity<ExamDto> updateExam(@PathVariable int examId, @RequestBody ExamDto examDto) {
        Exams exam = examsService.findById(examId);

        // Обновляем данные экзамена
        exam.setSubject(examDto.getSubject());
        exam.setCourse(examDto.getCourse());

        examsService.update(exam); // Обновление экзамена в базе данных

        return ResponseEntity.ok(examDto); // Возвращаем обновленные данные
    }
}
