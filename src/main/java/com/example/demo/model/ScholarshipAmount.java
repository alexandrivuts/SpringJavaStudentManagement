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

    @Column(name = "min_average", unique = true)
    private BigDecimal minAverage; // изменено с Float на BigDecimal

    @Column(name = "max_average", unique = true)
    private BigDecimal maxAverage; // изменено с Float на BigDecimal

    @Column(name = "amount", unique = true)
    private BigDecimal amount; // изменено с int на BigDecimal

    public int getAmount_id() {
        return amountId;
    }

    public void setAmount_id(int amountId) {
        this.amountId = amountId;
    }

    public BigDecimal getMin_average() {
        return minAverage;
    }

    public void setMinAverage(BigDecimal minAverage) {
        this.minAverage = minAverage;
    }

    public BigDecimal getMaxAverage() {
        return maxAverage;
    }

    public void setMax_average(BigDecimal maxAverage) {
        this.maxAverage = maxAverage;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

}
