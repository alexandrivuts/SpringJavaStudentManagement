package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "student_groups")
@Getter // Lombok - генерация геттеров
@Setter // Lombok - генерация сеттеров
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id", nullable = false)
    private int group_id;

    @Column(name = "groupNumber", unique = true)
    private int groupNumber;

    @Column(name = "course")
    private int course;

    @Column(name = "faculty")
    private String faculty;

    @Column(name = "specialization")
    private String specialization;

    // Конструкторы
    public Group() {}

    public Group(int groupNumber, int course, String faculty) {
        this.groupNumber = groupNumber;
        this.course = course;
        this.faculty = faculty;
    }
}