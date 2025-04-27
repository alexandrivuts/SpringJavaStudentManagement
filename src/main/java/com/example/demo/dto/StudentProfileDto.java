package com.example.demo.dto;

public class StudentProfileDto {
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String birthday;
    private int groupNumber;
    private int course;
    private String faculty;
    private String specialization;
    private double averageGrade;
    private int studentId;  // Добавляем поле для studentId

    public StudentProfileDto() {}

    public String getName() {
        return name != null ? name : "";
    }

    public String getSurname() {
        return surname != null ? surname : "";
    }

    public String getEmail() {
        return email != null ? email : "";
    }

    public String getPhoneNumber() {
        return phoneNumber != null ? phoneNumber : "";
    }

    public String getBirthday() {
        return birthday != null ? birthday : "";
    }

    public int getGroupNumber() { return groupNumber; }
    public int getCourse() { return course; }
    public String getFaculty() { return faculty != null ? faculty : ""; }
    public String getSpecialization() { return specialization != null ? specialization : ""; }
    public double getAverageGrade() { return averageGrade; }

    // Добавленный getter для studentId
    public int getStudentId() {
        return studentId;
    }

    public void setName(String name) {
        this.name = name != null ? name.trim() : "";
    }

    public void setSurname(String surname) {
        this.surname = surname != null ? surname.trim() : "";
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim() : "";
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber != null ? phoneNumber.trim() : "";
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday != null ? birthday.trim() : "";
    }

    public void setGroupNumber(int groupNumber) { this.groupNumber = groupNumber; }
    public void setCourse(int course) { this.course = course; }
    public void setFaculty(String faculty) { this.faculty = faculty != null ? faculty.trim() : ""; }
    public void setSpecialization(String specialization) { this.specialization = specialization != null ? specialization.trim() : ""; }
    public void setAverageGrade(double averageGrade) { this.averageGrade = averageGrade; }

    // Добавленный setter для studentId
    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }
}
