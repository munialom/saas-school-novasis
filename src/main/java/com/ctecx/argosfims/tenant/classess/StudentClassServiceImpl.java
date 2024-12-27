package com.ctecx.argosfims.tenant.classess;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentClassServiceImpl implements StudentClassService {

    private final StudentClassRepository studentClassRepository;

    @Autowired
    public StudentClassServiceImpl(StudentClassRepository studentClassRepository) {
        this.studentClassRepository = studentClassRepository;
    }

    @Override
    public StudentClass createClass(StudentClass studentClass) {
        return studentClassRepository.save(studentClass);
    }

    @Override
    public StudentClass updateClass(Integer id, StudentClass studentClass) {
        StudentClass existingClass = getClassById(id);
        existingClass.setClassName(studentClass.getClassName());
        existingClass.setStatus(studentClass.isStatus());
        return studentClassRepository.save(existingClass);
    }

    @Override
    public StudentClass getClassById(Integer id) {
        return studentClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found with id: " + id));
    }

    @Override
    public List<StudentClass> getAllClasses() {
        return studentClassRepository.findAll();
    }

    @Override
    public void deleteClass(Integer id) {
        StudentClass studentClass = getClassById(id);
        studentClassRepository.delete(studentClass);
    }

    @Override
    public StudentClass toggleStatus(Integer id) {
        StudentClass studentClass = getClassById(id);
        studentClass.setStatus(!studentClass.isStatus());
        return studentClassRepository.save(studentClass);
    }
}