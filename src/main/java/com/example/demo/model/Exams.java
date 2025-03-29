package com.example.demo.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "exams")
public class Exams implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_id", nullable = false)
    private int examId;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "course")
    private int course;

    // Геттеры и сеттеры

    public int getExamId() {
        return examId;
    }

    public void setExamId(int examId) {
        this.examId = examId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getCourse() {
        return course;
    }

    public void setCourse(int course) {
        this.course = course;
    }

    @Override
    public String toString() {
        return "Exams{" +
                "examId=" + examId +
                ", subject='" + subject + '\'' +
                ", course=" + course +
                '}';
    }
}
