package com.ctecx.argosfims.tenant.parents;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentParentRepository extends JpaRepository<StudentParent, Long> {
    List<StudentParent> findByStudentId(Long studentId);
}