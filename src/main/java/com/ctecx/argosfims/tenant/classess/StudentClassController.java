package com.ctecx.argosfims.tenant.classess;


import com.ctecx.argosfims.security.RequestAuthorization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PutMapping("/{id}")
    public ResponseEntity<StudentClass> updateClass(
            @PathVariable Integer id,
            @RequestBody StudentClass studentClass) {
        return ResponseEntity.ok(studentClassService.updateClass(id, studentClass));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentClass> getClassById(@PathVariable Integer id) {
        return ResponseEntity.ok(studentClassService.getClassById(id));
    }
    @RequestAuthorization
    @GetMapping
    public ResponseEntity<List<StudentClass>> getAllClasses() {
        return ResponseEntity.ok(studentClassService.getAllClasses());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Integer id) {
        studentClassService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<StudentClass> toggleStatus(@PathVariable Integer id) {
        return ResponseEntity.ok(studentClassService.toggleStatus(id));
    }
}