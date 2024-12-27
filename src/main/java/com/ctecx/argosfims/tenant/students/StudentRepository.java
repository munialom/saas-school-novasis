package com.ctecx.argosfims.tenant.students;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByAdmissionNumber(String admissionNumber);
    List<Student> findByStudentClassId(Integer classId);
    List<Student> findByStudentStreamId(Integer streamId);
    boolean existsByAdmissionNumber(String admissionNumber);
}