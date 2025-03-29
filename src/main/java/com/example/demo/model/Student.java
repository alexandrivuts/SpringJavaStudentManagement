package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "student")
@Getter
@Setter
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id", nullable = false)
    private int student_id;

    @Column(name = "averageGrade")
    private Double averageGrade;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, referencedColumnName = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    // Транзиентные поля (не сохраняются в БД)
    @Transient
    private String name;
    @Transient
    private String lastname;
    @Transient
    private int groupNumber;
    @Transient
    private String email;
    @Transient
    private int course;
    @Transient
    private String faculty;
    @Transient
    private String specialization;

    // Конструкторы
    public Student() {}

    public Student(User user, Group group) {
        this.user = user;
        this.group = group;
    }

    // Дополнительные методы доступа к данным
    public void loadTransientData() {
        if (user != null) {
            this.name = user.getName();
            this.lastname = user.getSurname();
            this.email = user.getEmail();
        }
        if (group != null) {
            this.groupNumber = group.getGroupNumber();
            this.course = group.getCourse();
            this.faculty = group.getFaculty();
            this.specialization = group.getSpecialization();
        }
    }
}