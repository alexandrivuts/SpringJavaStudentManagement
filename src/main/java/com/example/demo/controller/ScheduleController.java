package com.example.demo.controller;

import com.example.demo.service.BsuirScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {
    private final BsuirScheduleService scheduleService;

    public ScheduleController(BsuirScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/group/{groupNumber}")
    public ResponseEntity<String> getGroupSchedule(@PathVariable String groupNumber) {
        try {
            String schedule = scheduleService.getGroupSchedule(groupNumber);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Ошибка при получении расписания");
        }
    }
}