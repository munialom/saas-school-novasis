// StudentStreamController.java
package com.ctecx.argosfims.tenant.streams;

import com.ctecx.argosfims.security.RequestAuthorization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/streams")

public class StudentStreamController {
    private final StudentStreamService studentStreamService;

    @Autowired
    public StudentStreamController(StudentStreamService studentStreamService) {
        this.studentStreamService = studentStreamService;
    }

    @PostMapping
    public ResponseEntity<StudentStream> createStream(@RequestBody StudentStream studentStream) {
        return ResponseEntity.ok(studentStreamService.createStream(studentStream));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentStream> updateStream(
            @PathVariable Integer id,
            @RequestBody StudentStream studentStream) {
        return ResponseEntity.ok(studentStreamService.updateStream(id, studentStream));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentStream> getStreamById(@PathVariable Integer id) {
        return ResponseEntity.ok(studentStreamService.getStreamById(id));
    }
    @RequestAuthorization
    @GetMapping
    public ResponseEntity<List<StudentStream>> getAllStreams() {
        return ResponseEntity.ok(studentStreamService.getAllStreams());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStream(@PathVariable Integer id) {
        studentStreamService.deleteStream(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<StudentStream> toggleStatus(@PathVariable Integer id) {
        return ResponseEntity.ok(studentStreamService.toggleStatus(id));
    }
}