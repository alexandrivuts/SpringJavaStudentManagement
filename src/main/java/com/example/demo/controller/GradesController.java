package com.example.demo.controller;

import com.example.demo.model.Exams;
import com.example.demo.model.Grades;
import com.example.demo.model.Group;
import com.example.demo.model.Student;
import com.example.demo.repository.GradesRepository;
import com.example.demo.service.ExamsService;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grades")
public class GradesController {

    private final StudentService studentService;
    private final ExamsService examsService;
    private final GradesRepository gradesRepository;

    public GradesController(StudentService studentService, ExamsService examsService, GradesRepository gradesRepository) {
        this.studentService = studentService;
        this.examsService = examsService;
        this.gradesRepository = gradesRepository;
    }

    @GetMapping("/scholarship")
    @PreAuthorize("hasRole('ROLE_ACCOUNTANT')")
    public ResponseEntity<Map<String, Object>> getAverageGradeAndScholarship(Authentication auth) {
        String username = auth.getName();
        Student student = studentService.findByUsername(username);

        double averageGrade = studentService.calculateAverageGrade(student.getStudent_id());

        BigDecimal scholarshipAmount = studentService.calculateScholarshipAmount(student.getStudent_id());

        Map<String, Object> response = new HashMap<>();
        response.put("averageGrade", averageGrade);
        response.put("scholarshipAmount", scholarshipAmount);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addGradesToStudent(@RequestBody Map<String, Object> requestData) {
        try {
            System.out.println("Запрос на добавление оценок получен: " + requestData);

            int studentId = (Integer) requestData.get("studentId");
            Map<Long, Float> examGrades = new HashMap<>();
            ((Map<String, Object>) requestData.get("examGrades")).forEach((key, value) ->
                    examGrades.put(Long.parseLong(key), Float.parseFloat(value.toString()))
            );
            System.out.println("studentId: " + studentId);
            System.out.println("examGrades: " + examGrades);

            Student student = studentService.findById(studentId);
            if (student == null) {
                System.out.println("Студент не найден!");
                return ResponseEntity.badRequest().body("Student not found");
            }

            System.out.println("Студент найден: " + student.getStudent_id());

            Group group = student.getGroup();
            if (group == null) {
                System.out.println("Группа не найдена!");
                return ResponseEntity.badRequest().body("Group not found for student");
            }

            System.out.println("Группа найдена: " + group.getCourse());

            List<Exams> exams = examsService.findByCourse(group.getCourse());
            System.out.println("Найдено экзаменов: " + exams.size());

            for (Map.Entry<Long, Float> entry : examGrades.entrySet()) {
                Long examIdLong = entry.getKey();
                Float grade = entry.getValue();

                int examId = examIdLong.intValue();

                Exams exam = examsService.findById(examId);
                if (exam == null) {
                    System.out.println("Экзамен с ID " + examId + " не найден!");
                    continue;
                }

                Grades existingGrade = gradesRepository.findByStudentAndExams(student, exam);

                if (existingGrade != null) {
                    existingGrade.setGrade(grade);
                    gradesRepository.save(existingGrade);
                } else {
                    Grades gradeRecord = new Grades();
                    gradeRecord.setStudent(student);
                    gradeRecord.setExams(exam);
                    gradeRecord.setGrade(grade);
                    gradesRepository.save(gradeRecord);
                }

                System.out.println("✅ Оценка для экзамена " + examId + " обновлена или добавлена.");
            }

            List<Grades> studentGrades = gradesRepository.findByStudent_studentId(studentId);
            if (studentGrades.isEmpty()) {
                System.out.println("Нет оценок для студента!");
                return ResponseEntity.badRequest().body("No grades found for the student");
            }

            Double totalGrade = 0.0;
            for (Grades gradeRecord : studentGrades) {
                totalGrade += gradeRecord.getGrade();
            }

            Double averageGrade = totalGrade / studentGrades.size();
            student.setAverageGrade(averageGrade);
            studentService.update(student);

            System.out.println("Средний балл студента обновлен: " + averageGrade);

            return ResponseEntity.ok("Grades added successfully. Average grade: " + averageGrade);
        } catch (Exception e) {
            System.out.println("Ошибка: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error adding grades: " + e.getMessage());
        }
    }
}
