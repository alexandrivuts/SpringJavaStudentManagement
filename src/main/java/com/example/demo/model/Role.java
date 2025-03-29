package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "role")
@Data
public class Role {

    public enum RoleType {
        ADMIN,      // Полный доступ
        USER,       // Обычный пользователь (студент)
        ACCOUNTANT  // Бухгалтер (начисление стипендий)
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private RoleType name;

    // Примеры конструкторов
    public Role() {}

    public Role(RoleType name, String description) {
        this.name = name;
    }
}
