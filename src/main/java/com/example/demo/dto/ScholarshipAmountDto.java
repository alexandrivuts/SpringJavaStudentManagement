package com.example.demo.dto;

import java.math.BigDecimal;

public class ScholarshipAmountDto {

    private int amountId;
    private BigDecimal minAverage;
    private BigDecimal maxAverage;
    private BigDecimal amount;

    public ScholarshipAmountDto() {}

    public ScholarshipAmountDto(int amountId, BigDecimal minAverage, BigDecimal maxAverage, BigDecimal amount) {
        this.amountId = amountId;
        this.minAverage = minAverage;
        this.maxAverage = maxAverage;
        this.amount = amount;
    }

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
}

