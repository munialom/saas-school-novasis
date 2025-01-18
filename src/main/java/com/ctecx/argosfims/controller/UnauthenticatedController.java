package com.ctecx.argosfims.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/unauthenticated")
public class UnauthenticatedController {
    @PostMapping("/data")
    public ResponseEntity<String> receiveData(@RequestBody String data) {
        return ResponseEntity.ok("Data received.");
    }
}