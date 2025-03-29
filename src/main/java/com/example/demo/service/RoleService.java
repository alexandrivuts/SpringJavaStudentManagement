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

    // Метод для получения всех ролей
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // Метод для получения роли по ID
    public Optional<Role> getRoleById(int roleId) {
        return roleRepository.findById(roleId);
    }

    // Метод для добавления новой роли
    public Role addRole(Role role) {
        return roleRepository.save(role);
    }

    // Метод для обновления роли
    public Role updateRole(int roleId, Role updatedRole) {
        Optional<Role> existingRole = roleRepository.findById(roleId);
        if (existingRole.isPresent()) {
            Role role = existingRole.get();
            role.setRoleName(updatedRole.getRoleName());
            return roleRepository.save(role);
        } else {
            // Можно выбросить исключение, если запись не найдена
            throw new RuntimeException("Role not found");
        }
    }
    // Получение роли по умолчанию (например, USER)
    public Role getDefaultRole() {
        return roleRepository.findByRoleName("USER");
    }
    // Метод для удаления роли
    public void deleteRole(int roleId) {
        roleRepository.deleteById(roleId);
    }
}
