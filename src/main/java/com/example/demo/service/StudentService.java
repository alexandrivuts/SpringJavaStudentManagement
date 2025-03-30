package com.example.demo.service;

import com.example.demo.dto.TranscriptDto;
import com.example.demo.model.Exams;
import com.example.demo.model.Grades;
import com.example.demo.model.ScholarshipAmount;
import com.example.demo.model.Student;
import com.example.demo.repository.GradesRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final GradesRepository gradesRepository;
    private final GradesService gradesService;
    private final ExamsService examsService;
    private final ScholarshipAmountService scholarshipAmountService;  // Сервис для стипендий

    @Autowired
    public StudentService(StudentRepository studentRepository, GradesRepository gradesRepository, GradesService gradesService, ExamsService examsService, ScholarshipAmountService scholarshipAmountService) {
        this.studentRepository = studentRepository;
        this.gradesRepository = gradesRepository;
        this.gradesService = gradesService;
        this.examsService = examsService;
        this.scholarshipAmountService = scholarshipAmountService;  // Инициализация сервиса стипендий
    }

    // Вставка нового студента
    public void insert(Student student) {
        if (student.getUser() == null) {
            throw new IllegalArgumentException("Студент должен быть связан с пользователем.");
        }
        studentRepository.save(student);
    }

    // Обновление данных студента
    public void update(Student student) {
        if (student.getStudent_id() <= 0) {
            throw new IllegalArgumentException("Некорректный ID студента.");
        }
        studentRepository.save(student);
    }

    // Удаление студента
    public void delete(int studentId) {
        Student existingStudent = findById(studentId);
        studentRepository.delete(existingStudent);
    }

    // Поиск студента по ID
    public Student findById(int studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Студент с ID " + studentId + " не найден."));
    }

    // Получение всех студентов
    public List<Student> getAllStudents() {
        return studentRepository.findAll();  // Получаем всех студентов
    }

    // Поиск студентов по ID группы
    public List<Student> findByGroupId(int groupId) {
        List<Student> students = studentRepository.findAll().stream()
                .filter(student -> student.getGroup() != null && student.getGroup().getGroupId() == groupId)
                .toList();
        if (students.isEmpty()) {
            throw new IllegalArgumentException("Нет студентов в группе с ID " + groupId);
        }
        return students;
    }

    // Поиск студента по username
    public Student findByUsername(String username) {
        return studentRepository.findByUser_username(username)
                .orElseThrow(() -> new IllegalArgumentException("Студент с username " + username + " не найден."));
    }

    // Поиск студента по userId
    public Student findByUserId(int userId) {
        return studentRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Студент с user ID " + userId + " не найден."));
    }

    public List<Student> findStudentsByFullName(String firstName, String lastName) {
        return studentRepository.findByUser_NameAndUser_Surname(firstName, lastName);
    }

    // Получение зачетки студента
    public TranscriptDto getTranscript(int studentId) {
        Student student = findById(studentId);
        TranscriptDto transcriptDto = new TranscriptDto();

        // Заполняем данные о курсе
        if (student.getGroup() != null) {
            transcriptDto.setCourseName(student.getGroup().getFaculty() + " - " + student.getGroup().getSpecialization());
        }

        // Получаем список экзаменов для курса
        List<Exams> exams = getExamsForStudent(student);

        // Преобразуем экзамены и оценки в DTO
        List<TranscriptDto.ExamDto> examDtos = exams.stream()
                .map(exam -> {
                    TranscriptDto.ExamDto examDto = new TranscriptDto.ExamDto();
                    examDto.setSubject(exam.getSubject());

                    // Ищем оценку для экзамена
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

    // Метод для получения экзаменов студента (например, по группе или курсу)
    private List<Exams> getExamsForStudent(Student student) {
        // Проверяем, есть ли группа у студента
        if (student.getGroup() == null) {
            throw new IllegalArgumentException("У студента нет группы.");
        }

        // Получаем курс студента из его группы
        int studentCourse = student.getGroup().getCourse();

        // Возвращаем список экзаменов, которые относятся к курсу студента
        return examsService.findByCourse(studentCourse);
    }

    // Метод для поиска оценки студента по конкретному экзамену
    private Grades findGradeForStudent(Student student, Exams exam) {
        return gradesRepository.findByStudentAndExams(student, exam);
    }

    // Метод для расчета среднего балла студента
    public double calculateAverageGrade(int studentId) {
        List<Grades> grades = gradesRepository.findByStudent_studentId(studentId);
        if (grades == null || grades.isEmpty()) return 0.0;

        return grades.stream()
                .filter(g -> g.getGrade() != null)
                .mapToDouble(Grades::getGrade)
                .average()
                .orElse(0.0);
    }

    // Метод для получения суммы стипендии на основе среднего балла
    public BigDecimal calculateScholarshipAmount(int studentId) {
        double averageGrade = calculateAverageGrade(studentId);

        // Находим соответствующую сумму стипендии на основе среднего балла
        List<ScholarshipAmount> scholarshipAmounts = scholarshipAmountService.findAll();
        for (ScholarshipAmount scholarshipAmount : scholarshipAmounts) {
            if (averageGrade >= scholarshipAmount.getMin_average().doubleValue()
                    && averageGrade <= scholarshipAmount.getMaxAverage().doubleValue()) {
                return scholarshipAmount.getAmount();
            }
        }
        // Если не найдено соответствие, возвращаем нулевую сумму
        return BigDecimal.ZERO;
    }
}
