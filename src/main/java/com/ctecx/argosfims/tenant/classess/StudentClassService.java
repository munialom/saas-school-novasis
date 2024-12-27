package com.ctecx.argosfims.tenant.classess;

import java.util.List;

public interface StudentClassService {
    StudentClass createClass(StudentClass studentClass);
    StudentClass updateClass(Integer id, StudentClass studentClass);
    StudentClass getClassById(Integer id);
    List<StudentClass> getAllClasses();
    void deleteClass(Integer id);
    StudentClass toggleStatus(Integer id);
}