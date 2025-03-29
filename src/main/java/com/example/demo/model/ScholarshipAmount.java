package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "scholarship_amount")
@Getter
@Setter
public class ScholarshipAmount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "amount_id", nullable = false)
    private int amount_id;

    @Column(name = "min_average", unique = true)
    private BigDecimal min_average;

    @Column(name = "max_average", unique = true)
    private BigDecimal max_average;

    @Column(name = "amount", unique = true)
    private BigDecimal amount;

    // Конструкторы
    public ScholarshipAmount() {}

    public ScholarshipAmount(BigDecimal min_average, BigDecimal max_average, BigDecimal amount) {
        this.min_average = min_average;
        this.max_average = max_average;
        this.amount = amount;
    }
}
