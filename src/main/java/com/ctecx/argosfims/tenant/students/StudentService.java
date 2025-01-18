package com.ctecx.argosfims.tenant.students;

import com.ctecx.argosfims.tenant.classess.StudentClass;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;

public interface StudentService {
    Student createStudent(StudentDTO studentDTO);





}