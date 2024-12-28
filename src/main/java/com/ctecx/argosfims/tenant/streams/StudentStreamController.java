// StudentStreamController.java
package com.ctecx.argosfims.tenant.streams;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


}