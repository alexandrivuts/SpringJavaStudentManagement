package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private int user_id;  // Оставляем исходное название поля

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "birthday", nullable = false)
    private String birthday;  // Восстановлено

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phoneNumber", nullable = false)
    private String phoneNumber;  // Возвращаем nullable=false

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;  // Новая связь (оставляем)

    public User(String username, String password, String name, String surname,
                String birthday, String email, String phoneNumber, Role role) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.birthday = birthday;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }
}