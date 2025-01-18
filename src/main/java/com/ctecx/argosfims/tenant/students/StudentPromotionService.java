package com.ctecx.argosfims.tenant.students;

import com.ctecx.argosfims.tenant.classess.StudentClass;
import com.ctecx.argosfims.tenant.finance.CustomFinanceRepository;
import com.ctecx.argosfims.tenant.school.SchoolService;
import com.ctecx.argosfims.tenant.streams.StudentStream;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentPromotionService {

    private static final Logger log = LoggerFactory.getLogger(StudentPromotionService.class);

    private final CustomFinanceRepository customFinanceRepository;
    private final StudentRepository studentRepository;
    private final SchoolService schoolService;

    public List<Student> getStudentsByClass(int classId) {
        log.info("Fetching active students for class ID: {}", classId);
        List<Map<String, Object>> studentData = customFinanceRepository
                .getActiveStudentsByClassAndAdmission(classId, "SESSION");
        if (studentData.isEmpty()) {
            log.error("No students found for class ID: {}", classId);
            throw new EntityNotFoundException("No students found for class: " + classId);
        }
        List<Student> students = studentData.stream().map(this::mapStudent).collect(Collectors.toList());
        log.info("Found {} students for class ID: {}", students.size(), classId);
        return students;
    }

    @Transactional
    public void promoteStudents(PromotionDTO promotion) {
        Integer currentClassId = promotion.getCurrentClassId();
        Integer nextClassId = promotion.getNextClassId();
        String opcode = promotion.getOpcode();

        List<Student> students = getStudentsByClass(currentClassId);

        List<Student> updatedStudents = new ArrayList<>();


        for (Student student : students) {
            try {
                if ("ALUMNI".equals(opcode)) {
                    student.setStatus(false);
                    student.setAdmission(Admission.ALUMNI);
                    student.setStudentClass(null);
                    //Crucial: Don't update the student's class if it's an alumni promotion.
                } else {
                    // Important check for null, now that you want to update if not Alumni
                    if (nextClassId != null) {
                        StudentClass nextClass = getStudentClassById(nextClassId);
                        student.setYearOf(student.getYearOf() + 1);
                        student.setStudentClass(nextClass);
                    }
                }

                updatedStudents.add(student);


            } catch (EntityNotFoundException enfe) {
                log.error("Entity not found error during student promotion for student {}: {}", student.getId(), enfe.getMessage(), enfe);
                throw new RuntimeException("Error during student promotion, could not find requierd resources: " + enfe.getMessage(), enfe);
            }
            catch (Exception e) {
                log.error("Error processing student with ID: {}. Details: {}", student.getId(), e.getMessage(), e);
                throw new RuntimeException("Error processing student with ID: " + student.getId(), e);
            }
        }

        try {
            studentRepository.saveAll(updatedStudents);
        }catch (Exception e){
            log.error("Error saving all students: {}", e.getMessage(), e);
            throw new RuntimeException("Error saving all students ", e );
        }
        log.info("Promotion completed for {} students.", students.size());
    }


    private Student mapStudent(Map<String, Object> studentData) {
        log.debug("Mapping student data: {}", studentData);

        Student student = new Student();
        student.setId(((Number) studentData.get("Id")).longValue());
        student.setAdmissionNumber((String) studentData.get("AdmissionNumber"));
        student.setFullName((String) studentData.get("FullName"));
        student.setAdmission(Admission.valueOf(Optional.ofNullable((String) studentData.get("Admission")).orElse("SESSION"))); // Added null check
        student.setMode(Mode.valueOf(Optional.ofNullable((String) studentData.get("Mode")).orElse("REGULAR"))); // Added null check
        StudentClass studentClass = new StudentClass();
        studentClass.setId((int) ((Number) studentData.get("ClassId")).longValue());
        studentClass.setClassName((String) studentData.get("ClassName"));
        student.setStudentClass(studentClass);

        StudentStream studentStream = new StudentStream();
        studentStream.setId((int) ((Number) studentData.get("StreamId")).longValue());
        studentStream.setStreamName((String) studentData.get("StreamName"));
        student.setStudentStream(studentStream);

        log.debug("Mapped Student: {}", student);
        return student;
    }

    private StudentClass getStudentClassById(int classId) {
        log.info("Fetching class data for class ID: {}", classId);
        List<Map<String, Object>> classData = schoolService.getClassById(classId);

        if (classData.isEmpty()) {
            log.error("No class found for class ID: {}", classId);
            throw new EntityNotFoundException("Class not found with ID: " + classId);
        }

        return mapStudentClass(classData.get(0));
    }

    private StudentClass mapStudentClass(Map<String, Object> classData) {
        log.debug("Mapping class data: {}", classData);
        StudentClass studentClass = new StudentClass();
        studentClass.setId(((Number) classData.get("Id")).intValue());
        studentClass.setClassName((String) classData.get("ClassName"));
        log.debug("Mapped StudentClass: {}", studentClass);
        return studentClass;
    }
}