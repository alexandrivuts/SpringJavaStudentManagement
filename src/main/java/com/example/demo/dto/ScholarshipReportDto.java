package com.example.demo.dto;

import java.math.BigDecimal;

public class ScholarshipReportDto {
    private String fullName;
    private String groupNumber;
    private BigDecimal averageGrade;
    private BigDecimal scholarshipAmount;

    public ScholarshipReportDto() {}

    public ScholarshipReportDto(String fullName, String groupNumber,
                                BigDecimal averageGrade, BigDecimal scholarshipAmount) {
        this.fullName = fullName;
        this.groupNumber = groupNumber;
        this.averageGrade = averageGrade;
        this.scholarshipAmount = scholarshipAmount;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(String groupNumber) {
        this.groupNumber = groupNumber;
    }

    public BigDecimal getAverageGrade() {
        return averageGrade;
    }

    public void setAverageGrade(BigDecimal averageGrade) {
        this.averageGrade = averageGrade;
    }

    public BigDecimal getScholarshipAmount() {
        return scholarshipAmount;
    }

    public void setScholarshipAmount(BigDecimal scholarshipAmount) {
        this.scholarshipAmount = scholarshipAmount;
    }
}