package com.example.demo.repository;

import com.example.demo.model.Role;
import com.example.demo.model.Role.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(RoleType name);
    boolean existsByName(RoleType name);
}