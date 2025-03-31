package com.example.demo.service;

import com.example.demo.model.Role;
import com.example.demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(int roleId) {
        return roleRepository.findById(roleId);
    }

    public Role addRole(Role role) {
        return roleRepository.save(role);
    }

    public Role updateRole(int roleId, Role updatedRole) {
        Optional<Role> existingRole = roleRepository.findById(roleId);
        if (existingRole.isPresent()) {
            Role role = existingRole.get();
            role.setRoleName(updatedRole.getRoleName());
            return roleRepository.save(role);
        } else {
            throw new RuntimeException("Role not found");
        }
    }

    public Role getDefaultRole() {
        return roleRepository.findByRoleId(1);
    }

    public void deleteRole(int roleId) {
        roleRepository.deleteById(roleId);
    }
}
