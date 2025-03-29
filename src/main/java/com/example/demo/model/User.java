package com.example.demo.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;

@Entity
@Table(name = "user")
public class User implements UserDetails, Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false)
    private String email;

    @OneToOne(mappedBy = "user")
    private Student student;

    // Конструктор по умолчанию
    public User() {
    }

    // Геттер для userId
    public int getUserId() {
        return userId;
    }

    // Сеттер для userId
    public void setUserId(int userId) {
        this.userId = userId;
    }

    // Геттер для username
    public String getUsername() {
        return username;
    }

    // Сеттер для username
    public void setUsername(String username) {
        this.username = username;
    }

    // Геттер для password
    public String getPassword() {
        return password;
    }

    // Сеттер для password
    public void setPassword(String password) {
        this.password = password;
    }

    // Геттер для email
    public String getEmail() {
        return email;
    }

    // Сеттер для email
    public void setEmail(String email) {
        this.email = email;
    }

    // Геттер для student
    public Student getStudent() {
        return student;
    }

    // Сеттер для student
    public void setStudent(Student student) {
        this.student = student;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Тут можно добавить логику для ролей пользователя (например, добавить роль пользователя)
        return null; // Пока ничего не возвращаем, можно реализовать через роль, если нужно
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Если необходимо, добавь логику для проверки
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Если необходимо, добавь логику для проверки
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Если необходимо, добавь логику для проверки
    }

    @Override
    public boolean isEnabled() {
        return true; // Если необходимо, добавь логику для проверки
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
