package com.example.demo.dto;

public class StudentProfileDto {
    private String name;
    private String surname;
    private String email;
    private int groupNumber;
    private int course;
    private String faculty;
    private String specialization;
    private double averageGrade;

    // Геттеры
    public String getName() { return name; }
    public String getSurname() { return surname; }
    public String getEmail() { return email; }
    public int getGroupNumber() { return groupNumber; }
    public int getCourse() { return course; }
    public String getFaculty() { return faculty; }
    public String getSpecialization() { return specialization; }
    public double getAverageGrade() { return averageGrade; }

    // Сеттеры
    public void setName(String name) { this.name = name; }
    public void setSurname(String surname) { this.surname = surname; }
    public void setEmail(String email) { this.email = email; }
    public void setGroupNumber(int groupNumber) { this.groupNumber = groupNumber; }
    public void setCourse(int course) { this.course = course; }
    public void setFaculty(String faculty) { this.faculty = faculty; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public void setAverageGrade(double averageGrade) { this.averageGrade = averageGrade; }
}