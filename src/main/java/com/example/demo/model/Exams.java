package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "exams")
@Getter
@Setter
public class Exams {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_id", nullable = false)
    private int exam_id;

    @Column(name = "subject", unique = true)
    private String subject;

    @Column(name = "course")
    private int course;

    // Конструкторы
    public Exams() {}

    public Exams(String subject, int course) {
        this.subject = subject;
        this.course = course;
    }

    // Дополнительные методы
    public String getExamInfo() {
        return String.format("%s (Курс %d)", subject, course);
    }
}
