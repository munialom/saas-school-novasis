package com.ctecx.argosfims.tenant.classess;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/classes")
public class StudentClassController {

    private final StudentClassService studentClassService;

    @Autowired
    public StudentClassController(StudentClassService studentClassService) {
        this.studentClassService = studentClassService;
    }

    @PostMapping
    public ResponseEntity<StudentClass> createClass(@RequestBody StudentClass studentClass) {
        return ResponseEntity.ok(studentClassService.createClass(studentClass));
    }



}