package com.example.demo.repository;

import com.example.demo.model.ScholarshipAmount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScholarshipAmountRepository extends JpaRepository<ScholarshipAmount, Integer> {

    @Query("SELECT sa FROM ScholarshipAmount sa WHERE :average BETWEEN sa.min_average AND sa.max_average")
    Optional<ScholarshipAmount> findScholarshipByAverage(BigDecimal average);

    List<ScholarshipAmount> findByAmountGreaterThanEqual(BigDecimal minAmount);

    Optional<ScholarshipAmount> findByMinAverage(BigDecimal minAverage);
}