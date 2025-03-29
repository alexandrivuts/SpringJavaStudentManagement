package com.example.demo.repository;

import com.example.demo.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    Optional<Group> findByGroupNumber(int groupNumber);
    List<Group> findByCourse(int course);
    List<Group> findByFaculty(String faculty);
    List<Group> findBySpecialization(String specialization);
}