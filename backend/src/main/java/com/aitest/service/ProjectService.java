package com.aitest.service;

import com.aitest.entity.Project;
import com.aitest.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    public List<Project> getAllProjects() {
        return repository.findAll();
    }

    public Project getProjectById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Project createProject(Project project) {
        return repository.save(project);
    }
}
