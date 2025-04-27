package com.example.demo.dto;

public class ExamDto {
    private int examId;  // Добавляем ID
    private String subject;
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
}