package com.example.demo.service;

import com.example.demo.dto.ScholarshipReportDto;
import com.example.demo.dto.TranscriptDto;
import com.example.demo.model.*;
import com.example.demo.repository.GradesRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final GradesRepository gradesRepository;
    private final ExamsService examsService;
    private final ScholarshipAmountService scholarshipAmountService;

    @Autowired
    public StudentService(UserRepository userRepository, StudentRepository studentRepository, GradesRepository gradesRepository, ExamsService examsService, ScholarshipAmountService scholarshipAmountService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.gradesRepository = gradesRepository;
        this.examsService = examsService;
        this.scholarshipAmountService = scholarshipAmountService;
    }

    public void insert(Student student) {
        if (student.getUser() == null) {
            throw new IllegalArgumentException("Студент должен быть связан с пользователем.");
        }
        studentRepository.save(student);
    }

    public void update(Student student) {
        if (student.getStudent_id() <= 0) {
            throw new IllegalArgumentException("Некорректный ID студента.");
        }
        studentRepository.save(student);
    }

    @Transactional
    public void delete(int studentId) {
        Student student = findById(studentId);
        if (student == null) {
            throw new EntityNotFoundException("Student with ID " + studentId + " not found");
        }
        User user = student.getUser();
        studentRepository.delete(student);
        if (user != null) {
            userRepository.delete(user);
        }
    }

    public Student findById(int studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Студент с ID " + studentId + " не найден."));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> findByGroupId(int groupId) {
        List<Student> students = studentRepository.findAll().stream()
                .filter(student -> student.getGroup() != null && student.getGroup().getGroupId() == groupId)
                .toList();
        if (students.isEmpty()) {
            throw new IllegalArgumentException("Нет студентов в группе с ID " + groupId);
        }
        return students;
    }

    public Student findByUsername(String username) {
        return studentRepository.findByUser_username(username)
                .orElseThrow(() -> new IllegalArgumentException("Студент с username " + username + " не найден."));
    }

    public Student findByUserId(int userId) {
        return studentRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Студент с user ID " + userId + " не найден."));
    }

    public List<Student> findStudentsByFullName(String firstName, String lastName) {
        return studentRepository.findByUser_NameAndUser_Surname(firstName, lastName);
    }

    public TranscriptDto getTranscript(int studentId) {
        Student student = findById(studentId);
        TranscriptDto transcriptDto = new TranscriptDto();

        if (student.getGroup() != null) {
            transcriptDto.setCourseName(student.getGroup().getFaculty() + " - " + student.getGroup().getSpecialization());
        }

        List<Exams> exams = getExamsForStudent(student);
        List<TranscriptDto.ExamDto> examDtos = exams.stream()
                .map(exam -> {
                    TranscriptDto.ExamDto examDto = new TranscriptDto.ExamDto();
                    examDto.setSubject(exam.getSubject());

                    Grades grade = findGradeForStudent(student, exam);
                    if (grade != null) {
                        examDto.setGrade(grade.getGrade());
                    }
                    return examDto;
                })
                .collect(Collectors.toList());

        transcriptDto.setExams(examDtos);

        return transcriptDto;
    }

    private List<Exams> getExamsForStudent(Student student) {
        if (student.getGroup() == null) {
            throw new IllegalArgumentException("У студента нет группы.");
        }

        int studentCourse = student.getGroup().getCourse();

        return examsService.findByCourse(studentCourse);
    }

    private Grades findGradeForStudent(Student student, Exams exam) {
        return gradesRepository.findByStudentAndExams(student, exam);
    }

    public double calculateAverageGrade(int studentId) {
        List<Grades> grades = gradesRepository.findByStudent_studentId(studentId);
        if (grades == null || grades.isEmpty()) return 0.0;

        return grades.stream()
                .filter(g -> g.getGrade() != null)
                .mapToDouble(Grades::getGrade)
                .average()
                .orElse(0.0);
    }

    public BigDecimal calculateScholarshipAmount(int studentId) {
        double averageGrade = calculateAverageGrade(studentId);

        List<ScholarshipAmount> scholarshipAmounts = scholarshipAmountService.findAll();
        for (ScholarshipAmount scholarshipAmount : scholarshipAmounts) {
            if (averageGrade >= scholarshipAmount.getMin_average().doubleValue()
                    && averageGrade <= scholarshipAmount.getMaxAverage().doubleValue()) {
                return scholarshipAmount.getAmount();
            }
        }
        return BigDecimal.ZERO;
    }

    public List<ScholarshipReportDto> generateScholarshipReport() {
        List<Student> allStudents = studentRepository.findAll();

        return allStudents.stream()
                .filter(student -> student.getAverageGrade() != null)
                .map(student -> {
                    BigDecimal avgGrade = BigDecimal.valueOf(student.getAverageGrade());
                    BigDecimal amount = scholarshipAmountService.calculateScholarship(avgGrade.doubleValue());

                    return new ScholarshipReportDto(
                            student.getUser().getName() + " " + student.getUser().getSurname(),
                            student.getGroup() != null ? String.valueOf(student.getGroup().getGroupNumber()) : "N/A",
                            avgGrade,
                            amount
                    );
                })
                .filter(dto -> dto.getScholarshipAmount().compareTo(BigDecimal.ZERO) > 0) // Только получающие стипендию
                .collect(Collectors.toList());
    }
}
