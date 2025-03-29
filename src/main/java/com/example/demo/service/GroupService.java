package com.example.demo.service;

import com.example.demo.model.Group;
import com.example.demo.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public void insert(Group group) {
        if (isGroupNumberUnique(group.getGroupNumber())) {
            groupRepository.save(group);
        } else {
            throw new IllegalArgumentException("Group number must be unique.");
        }
    }

    public void update(Group group) {
        if (isGroupNumberUniqueForUpdate(group.getGroupNumber(), group.getGroupId())) {
            groupRepository.save(group);
        } else {
            throw new IllegalArgumentException("Group number must be unique.");
        }
    }

    public void delete(int groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new IllegalArgumentException("Group not found for deletion.");
        }
        groupRepository.deleteById(groupId);
    }

    public Group findById(int groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));
    }

    public List<Group> findAll() {
        List<Group> groups = groupRepository.findAll();
        if (groups.isEmpty()) {
            throw new IllegalStateException("No groups found.");
        }
        return groups;
    }

    public Group findByGroupNumber(int groupNumber) {
        Group group = groupRepository.findByGroupNumber(groupNumber);
        if (group == null) {
            throw new IllegalArgumentException("Group not found for group number: " + groupNumber);
        }
        return group;
    }

    public List<Group> findByFaculty(String faculty) {
        List<Group> groups = groupRepository.findByFaculty(faculty);
        if (groups.isEmpty()) {
            throw new IllegalStateException("No groups found for faculty: " + faculty);
        }
        return groups;
    }

    public List<Group> findByCourse(int course) {
        List<Group> groups = groupRepository.findByCourse(course);
        if (groups.isEmpty()) {
            throw new IllegalStateException("No groups found for course: " + course);
        }
        return groups;
    }

    private boolean isGroupNumberUnique(int groupNumber) {
        return groupRepository.findByGroupNumber(groupNumber) == null;
    }

    private boolean isGroupNumberUniqueForUpdate(int groupNumber, int groupId) {
        Group existingGroup = groupRepository.findByGroupNumber(groupNumber);
        return existingGroup == null || existingGroup.getGroupId() == groupId;
    }
}
