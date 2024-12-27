package com.ctecx.argosfims.tenant.students;

import java.util.List;

public interface StudentService {
    Student createStudent(StudentDTO studentDTO);
    Student updateStudent(Long id, StudentDTO studentDTO);
    Student getStudentById(Long id);
    Student getStudentByAdmissionNumber(String admissionNumber);
    List<Student> getAllStudents();
    List<Student> getStudentsByClass(Integer classId);
    List<Student> getStudentsByStream(Integer streamId);
    void deleteStudent(Long id);
    Student toggleStatus(Long id);

}