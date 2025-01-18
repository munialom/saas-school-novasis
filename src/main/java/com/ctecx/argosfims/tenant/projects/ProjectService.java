package com.ctecx.argosfims.tenant.projects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public Project updateProject(Long id, Project updatedProject){
        Optional<Project> optionalProject = projectRepository.findById(id);

        if(optionalProject.isPresent()){
            Project existingProject = optionalProject.get();

            existingProject.setProjectName(updatedProject.getProjectName());
            existingProject.setProjectType(updatedProject.getProjectType());
            existingProject.setProjectBudget(updatedProject.getProjectBudget());

            return projectRepository.save(existingProject);
        }else{
            return null;
        }

    }
}