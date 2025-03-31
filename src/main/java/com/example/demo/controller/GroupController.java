package com.example.demo.controller;

import com.example.demo.model.Group;
import com.example.demo.service.BsuirScheduleService;
import com.example.demo.service.GroupService;
import com.example.demo.service.StudentService;
import com.example.demo.model.Student;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> addGroup(@RequestBody Group group) {
        try {
            groupService.insert(group);  // Добавляем группу в базу
            return ResponseEntity.ok("Group added successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error adding group: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable int groupId) {
        try {
            groupService.delete(groupId);  // Удаляем группу по ID
            return ResponseEntity.ok("Group deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error deleting group: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        try {
            List<Group> groups = groupService.findAll();
            return ResponseEntity.ok(groups);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
