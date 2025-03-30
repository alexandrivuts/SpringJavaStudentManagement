package com.example.demo.dto;

public class ExamDto {

    private String subject;
    private int course;

    // Геттеры и сеттеры
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
