package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public void insert(Student student) {
        if (student.getUser() == null) {
            throw new IllegalArgumentException("Студент должен быть связан с пользователем.");
        }
        studentRepository.save(student);
    }

    public void update(Student student) {
        if (student.getStudent_id() <= 0) {
            throw new IllegalArgumentException("Некорректный ID студента.");
        }
        studentRepository.save(student);
    }

    public void delete(int studentId) {
        Student existingStudent = findById(studentId);
        studentRepository.delete(existingStudent);
    }

    public Student findById(int studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Студент с ID " + studentId + " не найден."));
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public List<Student> findByGroupId(int groupId) {
        List<Student> students = studentRepository.findAll().stream()
                .filter(student -> student.getGroup() != null && student.getGroup().getGroupId() == groupId)
                .toList();
        if (students.isEmpty()) {
            throw new IllegalArgumentException("Нет студентов в группе с ID " + groupId);
        }
        return students;
    }

    public Student findByUsername(String username) {
        return studentRepository.findByUser_username(username)
                .orElseThrow(() -> new IllegalArgumentException("Студент с username " + username + " не найден."));
    }

    public Student findByUserId(int userId) {
        return studentRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Студент с user ID " + userId + " не найден."));
    }
}
