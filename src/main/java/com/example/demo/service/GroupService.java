package com.example.demo.service;

import com.example.demo.model.Group;
import com.example.demo.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    // Метод для получения всех групп
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    // Метод для получения группы по ID
    public Optional<Group> getGroupById(int groupId) {
        return groupRepository.findById(groupId);
    }

    // Метод для добавления новой группы
    public Group addGroup(Group group) {
        return groupRepository.save(group);
    }

    // Метод для обновления группы
    public Group updateGroup(int groupId, Group updatedGroup) {
        Optional<Group> existingGroup = groupRepository.findById(groupId);
        if (existingGroup.isPresent()) {
            Group group = existingGroup.get();
            group.setGroupNumber(updatedGroup.getGroupNumber());
            group.setCourse(updatedGroup.getCourse());
            group.setFaculty(updatedGroup.getFaculty());
            group.setSpecialization(updatedGroup.getSpecialization());
            return groupRepository.save(group);
        } else {
            // Можно выбросить исключение, если запись не найдена
            throw new RuntimeException("Group not found");
        }
    }

    // Метод для удаления группы
    public void deleteGroup(int groupId) {
        groupRepository.deleteById(groupId);
    }
}
