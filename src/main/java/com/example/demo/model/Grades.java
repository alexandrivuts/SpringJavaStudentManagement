package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "grades")
@Getter
@Setter
public class Grades {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_id", nullable = false)
    private int grade_id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exams exam;

    @Column(name = "grade", nullable = false)
    private Float grade;

    // Конструкторы
    public Grades() {}

    public Grades(Student student, Exams exam, Float grade) {
        this.student = student;
        this.exam = exam;
        this.grade = grade;
    }

    // Дополнительные методы
    public String getGradeInfo() {
        return String.format("%s: %.1f (%s)",
                exam.getSubject(),
                grade,
                student.getUser().getSurname());
    }
}
