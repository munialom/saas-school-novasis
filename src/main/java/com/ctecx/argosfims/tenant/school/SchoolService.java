package com.ctecx.argosfims.tenant.school;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final CustomSchoolRepository schoolRepository;

    private final ObjectMapper objectMapper;

    public Map<String, Object> deleteStudent(int id){
        return schoolRepository.deleteStudent(id);
    }
    public  Map<String, Object> toggleStudentStatus(int id) {
        return schoolRepository.toggleStudentStatus(id);
    }

    public List<Map<String, Object>> searchStudentsWithPagination(String searchTerm, int pageNumber) {
        return Optional.ofNullable(searchTerm)
                .map(term -> schoolRepository.searchStudentsWithPagination(term, pageNumber))
                .orElse(Collections.emptyList());
    }


    public  Map<String, Object> deleteStream(StreamDeleteDTO streamDeleteDTO){
        return Optional.ofNullable(streamDeleteDTO)
                .filter(dto -> dto.getId() != null)
                .map(dto -> schoolRepository.deleteStream(dto.getId()))
                .orElse(Collections.emptyMap());
    }
    public  Map<String, Object> deleteClass(ClassDeleteDTO classDeleteDTO){
        return Optional.ofNullable(classDeleteDTO)
                .filter(dto -> dto.getId() != null)
                .map(dto -> schoolRepository.deleteClass(dto.getId()))
                .orElse(Collections.emptyMap());
    }
    public List<Map<String, Object>> getStudentParents(int id) {
        List<Map<String, Object>> parents = schoolRepository.getStudentParents(id);

        return parents.stream()
                .map(parent -> {
                    String parentDetailsString = (String) parent.get("ParentDetails");

                    if (parentDetailsString != null) {
                        try {
                            //remove backslashes
                            String cleanedString = parentDetailsString.replace("\\", "");
                            Map<String, Object> parentDetails = objectMapper.readValue(cleanedString, Map.class);
                            parent.put("ParentDetails", parentDetails);
                        } catch (JsonProcessingException e) {
                            System.out.println("could not process data "+e); // Log error
                            parent.put("ParentDetails", null);
                        }
                    } else {
                        parent.put("ParentDetails", null);
                    }
                    return parent;
                })
                .collect(Collectors.toList());
    }

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