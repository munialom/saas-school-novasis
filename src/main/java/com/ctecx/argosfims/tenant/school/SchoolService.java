package com.ctecx.argosfims.tenant.school;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final CustomSchoolRepository schoolRepository;

    public List<Map<String, Object>> getAllClasses() {
        return schoolRepository.getAllClasses();
    }

    public List<Map<String, Object>> getAllStreams() {
        return schoolRepository.getAllStreams();
    }

    public List<Map<String, Object>> getAllStudents() {
        return schoolRepository.getAllStudents();
    }

    public void updateClass(ClassUpdateDTO classDTO) {
        Optional.ofNullable(classDTO)
                .filter(dto -> dto.getId() != null)
                .ifPresent(schoolRepository::updateClass);
    }

    public void updateStream(StreamUpdateDTO streamDTO) {
        Optional.ofNullable(streamDTO)
                .filter(dto -> dto.getId() != null)
                .ifPresent(schoolRepository::updateStream);
    }

    public void updateStudent(StudentUpdateDTO studentDTO) {
        Optional.ofNullable(studentDTO)
                .filter(dto -> dto.getId() != null)
                .ifPresent(schoolRepository::updateStudent);
    }


    public List<Map<String, Object>> searchClasses(String searchTerm) {
        return Optional.ofNullable(searchTerm)
                .map(schoolRepository::searchClasses)
                .orElse(Collections.emptyList());
    }

    public List<Map<String, Object>> searchStreams(String searchTerm) {
        return Optional.ofNullable(searchTerm)
                .map(schoolRepository::searchStreams)
                .orElse(Collections.emptyList());
    }

    public List<Map<String, Object>> searchStudentByAdmission(String admission) {
        return Optional.ofNullable(admission)
                .map(schoolRepository::searchStudentByAdmission)
                .orElse(Collections.emptyList());
    }

    public List<Map<String, Object>> searchStudents(String searchTerm) {
        return Optional.ofNullable(searchTerm)
                .map(schoolRepository::searchStudents)
                .orElse(Collections.emptyList());
    }


    public List<Map<String, Object>> filterStudents(StudentFilterDTO filterDTO) {
        return Optional.ofNullable(filterDTO)
                .map(schoolRepository::filterStudents)
                .orElse(Collections.emptyList());
    }

    public List<Map<String, Object>> getStudentById(int id) {
        return schoolRepository.getStudentById(id);
    }

    public List<Map<String, Object>> getStudentByAdmissionNumber(String admissionNumber) {
        return schoolRepository.getStudentByAdmissionNumber(admissionNumber);
    }

    public List<Map<String, Object>> getClassById(int id) {
        return schoolRepository.getClassById(id);
    }

    public List<Map<String, Object>> getStreamById(int id) {
        return schoolRepository.getStreamById(id);
    }

}