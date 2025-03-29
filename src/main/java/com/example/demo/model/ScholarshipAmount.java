package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "scholarship_amount")
public class ScholarshipAmount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "amount_id", nullable = false)
    private int amountId;

    @Column(name = "min_average")
    private BigDecimal minAverage;

    @Column(name = "max_average")
    private BigDecimal maxAverage;

    @Column(name = "amount")
    private BigDecimal amount;

    // Геттеры и сеттеры

    public int getAmountId() {
        return amountId;
    }

    public void setAmountId(int amountId) {
        this.amountId = amountId;
    }

    public BigDecimal getMinAverage() {
        return minAverage;
    }

    public void setMinAverage(BigDecimal minAverage) {
        this.minAverage = minAverage;
    }

    public BigDecimal getMaxAverage() {
        return maxAverage;
    }

    public void setMaxAverage(BigDecimal maxAverage) {
        this.maxAverage = maxAverage;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "ScholarshipAmount{" +
                "amountId=" + amountId +
                ", minAverage=" + minAverage +
                ", maxAverage=" + maxAverage +
                ", amount=" + amount +
                '}';
    }
}
