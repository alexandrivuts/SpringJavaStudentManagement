package com.example.demo.repository;

import com.example.demo.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUser_username(String username);
    Optional<Student> findByUser_UserId(int userId);
    List<Student> findByUser_NameAndUser_Surname(String firstName, String lastName);
}
