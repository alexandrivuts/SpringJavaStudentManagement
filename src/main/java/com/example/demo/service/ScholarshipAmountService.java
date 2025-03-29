package com.example.demo.service;

import com.example.demo.model.ScholarshipAmount;
import com.example.demo.repository.ScholarshipAmountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScholarshipAmountService {

    @Autowired
    private ScholarshipAmountRepository scholarshipAmountRepository;

    // Метод для получения всех записей о стипендиях
    public List<ScholarshipAmount> getAllScholarshipAmounts() {
        return scholarshipAmountRepository.findAll();
    }

    // Метод для получения записи о стипендии по ID
    public Optional<ScholarshipAmount> getScholarshipAmountById(int amountId) {
        return scholarshipAmountRepository.findById(amountId);
    }

    // Метод для добавления новой записи о стипендии
    public ScholarshipAmount addScholarshipAmount(ScholarshipAmount scholarshipAmount) {
        return scholarshipAmountRepository.save(scholarshipAmount);
    }

    // Метод для обновления записи о стипендии
    public ScholarshipAmount updateScholarshipAmount(int amountId, ScholarshipAmount updatedScholarshipAmount) {
        Optional<ScholarshipAmount> existingScholarshipAmount = scholarshipAmountRepository.findById(amountId);
        if (existingScholarshipAmount.isPresent()) {
            ScholarshipAmount scholarshipAmount = existingScholarshipAmount.get();
            scholarshipAmount.setMinAverage(updatedScholarshipAmount.getMinAverage());
            scholarshipAmount.setMaxAverage(updatedScholarshipAmount.getMaxAverage());
            scholarshipAmount.setAmount(updatedScholarshipAmount.getAmount());
            return scholarshipAmountRepository.save(scholarshipAmount);
        } else {
            // Можно выбросить исключение, если запись не найдена
            throw new RuntimeException("ScholarshipAmount not found");
        }
    }

    // Метод для удаления записи о стипендии
    public void deleteScholarshipAmount(int amountId) {
        scholarshipAmountRepository.deleteById(amountId);
    }
}
