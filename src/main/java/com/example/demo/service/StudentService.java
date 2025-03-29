package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Метод для получения всех студентов
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Метод для получения студента по ID
    public Optional<Student> getStudentById(int studentId) {
        return studentRepository.findById(studentId);
    }

    // Метод для добавления нового студента
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    // Метод для обновления студента
    public Student updateStudent(int studentId, Student updatedStudent) {
        Optional<Student> existingStudent = studentRepository.findById(studentId);
        if (existingStudent.isPresent()) {
            Student student = existingStudent.get();
            student.setName(updatedStudent.getName());
            student.setLastname(updatedStudent.getLastname());
            student.setEmail(updatedStudent.getEmail());
            student.setAverageGrade(updatedStudent.getAverageGrade());
            // Можно добавить обновление других полей, если нужно
            return studentRepository.save(student);
        } else {
            // Можно выбросить исключение, если студент не найден
            throw new RuntimeException("Student not found");
        }
    }

    // Метод для удаления студента
    public void deleteStudent(int studentId) {
        studentRepository.deleteById(studentId);
    }
}
