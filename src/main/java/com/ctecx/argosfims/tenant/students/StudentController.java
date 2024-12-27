package com.ctecx.argosfims.tenant.students;

import com.ctecx.argosfims.security.RequestAuthorization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")

public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.createStudent(studentDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.updateStudent(id, studentDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/admission/{admissionNumber}")
    public ResponseEntity<Student> getStudentByAdmissionNumber(
            @PathVariable String admissionNumber) {
        return ResponseEntity.ok(studentService.getStudentByAdmissionNumber(admissionNumber));
    }
    @RequestAuthorization
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Student>> getStudentsByClass(@PathVariable Integer classId) {
        return ResponseEntity.ok(studentService.getStudentsByClass(classId));
    }

    @GetMapping("/stream/{streamId}")
    public ResponseEntity<List<Student>> getStudentsByStream(@PathVariable Integer streamId) {
        return ResponseEntity.ok(studentService.getStudentsByStream(streamId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Student> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.toggleStatus(id));
    }
}