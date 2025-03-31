package com.example.demo.controller;

import com.example.demo.dto.ScholarshipAmountDto;
import com.example.demo.model.ScholarshipAmount;
import com.example.demo.service.ScholarshipAmountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scholarship")
public class ScholarshipAmountController {

    private final ScholarshipAmountService scholarshipAmountService;

    public ScholarshipAmountController(ScholarshipAmountService scholarshipAmountService) {
        this.scholarshipAmountService = scholarshipAmountService;
    }

    @GetMapping("/all")
    @Secured("ROLE_ACCOUNTANT")
    public ResponseEntity<List<ScholarshipAmountDto>> getAllScholarships() {
        List<ScholarshipAmount> scholarshipAmounts = scholarshipAmountService.findAll();

        List<ScholarshipAmountDto> scholarshipAmountDtos = scholarshipAmounts.stream()
                .map(amount -> new ScholarshipAmountDto(
                        amount.getAmount_id(),
                        amount.getMin_average(),
                        amount.getMaxAverage(),
                        amount.getAmount()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(scholarshipAmountDtos);
    }

    @PutMapping("/update/{id}")
    @Secured("ROLE_ACCOUNTANT")
    public ResponseEntity<String> updateScholarship(
            @PathVariable int id,
            @RequestBody ScholarshipAmountDto scholarshipAmountDto) {

        ScholarshipAmount updatedScholarshipAmount = new ScholarshipAmount();
        updatedScholarshipAmount.setAmount_id(id);
        updatedScholarshipAmount.setMinAverage(scholarshipAmountDto.getMinAverage());
        updatedScholarshipAmount.setMax_average(scholarshipAmountDto.getMaxAverage());
        updatedScholarshipAmount.setAmount(scholarshipAmountDto.getAmount());

        try {
            scholarshipAmountService.update(updatedScholarshipAmount);
            return ResponseEntity.ok("ScholarshipAmount updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Failed to update ScholarshipAmount: " + e.getMessage());
        }
    }
}
