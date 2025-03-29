package com.example.demo.service;

import com.example.demo.model.ScholarshipAmount;
import com.example.demo.repository.ScholarshipAmountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ScholarshipAmountService {

    private final ScholarshipAmountRepository scholarshipAmountRepository;

    @Autowired
    public ScholarshipAmountService(ScholarshipAmountRepository scholarshipAmountRepository) {
        this.scholarshipAmountRepository = scholarshipAmountRepository;
    }

    public void insert(ScholarshipAmount scholarshipAmount) {
        if (isRangeValid(scholarshipAmount.getMin_average(), scholarshipAmount.getMaxAverage())
                && isRangeUnique(scholarshipAmount)) {
            scholarshipAmountRepository.save(scholarshipAmount);
        } else {
            throw new IllegalArgumentException("Invalid or overlapping scholarship range.");
        }
    }

    public void update(ScholarshipAmount scholarshipAmount) {
        if (isRangeValid(scholarshipAmount.getMin_average(), scholarshipAmount.getMaxAverage())
                && isRangeUniqueForUpdate(scholarshipAmount)) {
            scholarshipAmountRepository.save(scholarshipAmount);
        } else {
            throw new IllegalArgumentException("Invalid or overlapping scholarship range.");
        }
    }

    public void delete(int scholarshipAmountId) {
        Optional<ScholarshipAmount> existing = scholarshipAmountRepository.findById(scholarshipAmountId);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Scholarship amount not found for deletion.");
        }
        scholarshipAmountRepository.deleteById(scholarshipAmountId);
    }

    public ScholarshipAmount findById(int scholarshipAmountId) {
        return scholarshipAmountRepository.findById(scholarshipAmountId)
                .orElseThrow(() -> new IllegalArgumentException("Scholarship amount not found."));
    }

    public List<ScholarshipAmount> findAll() {
        return scholarshipAmountRepository.findAll();
    }

    private boolean isRangeValid(BigDecimal min, BigDecimal max) {
        return min != null && max != null && min.compareTo(max) < 0;
    }

    private boolean isRangeUnique(ScholarshipAmount scholarshipAmount) {
        List<ScholarshipAmount> existingAmounts = scholarshipAmountRepository.findByMinAverageLessThanAndMaxAverageGreaterThanEqual(
                scholarshipAmount.getMin_average(), scholarshipAmount.getMaxAverage());
        return existingAmounts.isEmpty();
    }

    private boolean isRangeUniqueForUpdate(ScholarshipAmount scholarshipAmount) {
        List<ScholarshipAmount> existingAmounts = scholarshipAmountRepository.findByMinAverageLessThanAndMaxAverageGreaterThanEqual(
                scholarshipAmount.getMin_average(), scholarshipAmount.getMaxAverage());
        return existingAmounts.isEmpty() || existingAmounts.stream()
                .allMatch(existing -> existing.getAmount_id() != scholarshipAmount.getAmount_id());
    }
}
