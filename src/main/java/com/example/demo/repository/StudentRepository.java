package com.example.demo.repository;

import com.example.demo.model.Group;
import com.example.demo.model.Student;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Student findByUser(User user);
    List<Student> findByGroup(Group group);
    List<Student> findByAverageGradeGreaterThanEqual(Double minAverage);
}