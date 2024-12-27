package com.ctecx.argosfims.tenant.streams;



import java.util.List;

public interface StudentStreamService {
    StudentStream createStream(StudentStream studentStream);
    StudentStream updateStream(Integer id, StudentStream studentStream);
    StudentStream getStreamById(Integer id);
    List<StudentStream> getAllStreams();
    void deleteStream(Integer id);
    StudentStream toggleStatus(Integer id);
}