package com.ctecx.argosfims.tenant.parents;

import com.ctecx.argosfims.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student-parents")
@RequiredArgsConstructor
public class StudentParentController {
    private final StudentParentService studentParentService;

    @PostMapping("/save")
    public ResponseEntity<?> saveParents(@RequestBody StudentParentRequest request) {
        try {
            List<StudentParent> savedParents = studentParentService.saveOrUpdateParents(request);
            return ResponseEntity.ok().body(savedParents);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}