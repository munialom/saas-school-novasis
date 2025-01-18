package com.ctecx.argosfims.tenant.students;

import com.ctecx.argosfims.tenant.finance.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final FinanceService financeService;

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.createStudent(studentDTO));
    }

    //New Endpoint for the new service method sp_GetActiveStudentsByClassStreamAndAdmission
    @GetMapping("/students/{classId}/{streamId}/{sessionMode}")
    public ResponseEntity<List<Map<String, Object>>> sp_GetActiveStudentsByClassStreamAndAdmission(
            @PathVariable int classId, @PathVariable int streamId, @PathVariable String sessionMode) {
        return ResponseEntity.ok(financeService.sp_GetActiveStudentsByClassStreamAndAdmission(classId,streamId, sessionMode));
    }

}