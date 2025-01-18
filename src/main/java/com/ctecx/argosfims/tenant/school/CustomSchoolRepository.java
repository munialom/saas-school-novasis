package com.ctecx.argosfims.tenant.school;

import java.util.List;
import java.util.Map;

public interface CustomSchoolRepository {

    List<Map<String, Object>> GetDashboardStats();

    List<Map<String, Object>> searchStudentsWithPagination(String searchTerm, int pageNumber);
    //Delete methods
    //New Toggle Status Method
    Map<String, Object> toggleStudentStatus(int id);
    Map<String, Object> deleteStudent(int id);
    Map<String, Object> deleteStream(int id);
    Map<String, Object> deleteClass(int id);

    List<Map<String, Object>> getStudentParents(int id);
    List<Map<String, Object>> getAllClasses();
    List<Map<String, Object>> getAllStreams();
    List<Map<String, Object>> getAllStudents();

    void updateClass(ClassUpdateDTO classDTO);
    void updateStream(StreamUpdateDTO streamDTO);
    void updateStudent(StudentUpdateDTO studentDTO);

    // Updated search methods
    List<Map<String, Object>> searchClasses(String searchTerm);
    List<Map<String, Object>> searchStreams(String searchTerm);
    List<Map<String, Object>> searchStudentByAdmission(String admission);
    List<Map<String, Object>> searchStudents(String searchTerm);
    List<Map<String, Object>> filterStudents(StudentFilterDTO filterDTO);

    //Single Record methods
    List<Map<String, Object>> getStudentById(int id);
    List<Map<String, Object>> getStudentByAdmissionNumber(String admissionNumber);
    List<Map<String, Object>> getClassById(int id);
    List<Map<String, Object>> getStreamById(int id);

}