package com.example.demo.repository;

import com.example.demo.model.ScholarshipAmount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ScholarshipAmountRepository extends JpaRepository<ScholarshipAmount, Integer> {
    List<ScholarshipAmount> findByMinAverageLessThanAndMaxAverageGreaterThanEqual(BigDecimal minAverage, BigDecimal maxAverage);
}
