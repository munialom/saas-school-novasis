package com.ctecx.argosfims.tenant.parents;

import com.ctecx.argosfims.tenant.school.SchoolService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentParentService {
    private final StudentParentRepository studentParentRepository;
    private final ObjectMapper objectMapper;
    private final SchoolService schoolService;

    @Transactional
    public List<StudentParent> saveOrUpdateParents(StudentParentRequest request) {
        // First check if student exists
        List<Map<String, Object>> studentCheck = schoolService.getStudentById(request.getStudentId().intValue());

        if (studentCheck == null || studentCheck.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + request.getStudentId());
        }

        // Get existing parents for this student
        List<StudentParent> existingParents = studentParentRepository
                .findByStudentId(request.getStudentId());

        // Create a map of existing parents by parent type for easy lookup
        Map<ParentType, StudentParent> existingParentsMap = existingParents.stream()
                .collect(Collectors.toMap(StudentParent::getParentType, parent -> parent));

        // Process each parent in the request
        List<StudentParent> parentsToSave = request.getParents().stream()
                .map(parentRecord -> {
                    StudentParent parent = existingParentsMap.getOrDefault(
                            parentRecord.getParentType(),
                            new StudentParent()
                    );

                    // Update or set new values
                    parent.setStudentId(request.getStudentId());
                    parent.setParentType(parentRecord.getParentType());
                    try {
                        parent.setParentDetails(objectMapper.writeValueAsString(parentRecord.getParentDetails()));
                    } catch (Exception e) {
                        throw new RuntimeException("Error processing parent details", e);
                    }

                    return parent;
                })
                .collect(Collectors.toList());

        // Save all parents
        return studentParentRepository.saveAll(parentsToSave);
    }
}