package com.ctecx.argosfims.tenant.school;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/school")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;


    @GetMapping("/students/search")
    public ResponseEntity<List<Map<String, Object>>> searchStudentsWithPagination(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "1") int pageNumber) {

        return ResponseEntity.ok(schoolService.searchStudentsWithPagination(searchTerm, pageNumber));
    }
    @DeleteMapping("/streams")
    public ResponseEntity<Map<String, Object>> deleteStream(@RequestBody StreamDeleteDTO streamDeleteDTO){
        Map<String, Object> result = schoolService.deleteStream(streamDeleteDTO);
        return !result.isEmpty() ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }
    @DeleteMapping("/classes")
    public ResponseEntity<Map<String, Object>> deleteClass(@RequestBody ClassDeleteDTO classDeleteDTO){
        Map<String, Object> result = schoolService.deleteClass(classDeleteDTO);
        return !result.isEmpty() ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping("/parents/{id}")
    public ResponseEntity<List<Map<String, Object>>> getStudentsParents(@PathVariable int id) {
        List<Map<String, Object>> student = schoolService.getStudentParents(id);
        return !student.isEmpty() ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }

    @GetMapping("/classes")
    public ResponseEntity<List<Map<String, Object>>> getAllClasses() {
        return ResponseEntity.ok(schoolService.getAllClasses());
    }

    @GetMapping("/streams")
    public ResponseEntity<List<Map<String, Object>>> getAllStreams() {
        return ResponseEntity.ok(schoolService.getAllStreams());
    }

    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getAllStudents() {
        return ResponseEntity.ok(schoolService.getAllStudents());
    }

    @PutMapping("/classes")
    public ResponseEntity<Void> updateClass(@RequestBody ClassUpdateDTO classDTO) {
        schoolService.updateClass(classDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/streams")
    public ResponseEntity<Void> updateStream(@RequestBody StreamUpdateDTO streamDTO) {
        schoolService.updateStream(streamDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/students")
    public ResponseEntity<Void> updateStudent(@RequestBody StudentUpdateDTO studentDTO) {
        schoolService.updateStudent(studentDTO);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/classes/search")
    public ResponseEntity<List<Map<String, Object>>> searchClasses(
            @RequestParam String searchTerm) {
        return ResponseEntity.ok(schoolService.searchClasses(searchTerm));
    }

    @GetMapping("/streams/search")
    public ResponseEntity<List<Map<String, Object>>> searchStreams(
            @RequestParam String searchTerm) {
        return ResponseEntity.ok(schoolService.searchStreams(searchTerm));
    }

    @GetMapping("/students/admission/{admission}")
    public ResponseEntity<List<Map<String, Object>>> searchStudentByAdmission(
            @PathVariable String admission) {
        List<Map<String, Object>> student = schoolService.searchStudentByAdmission(admission);
        return !student.isEmpty() ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }


   /* @GetMapping("/students/search")
    public ResponseEntity<List<Map<String, Object>>> searchStudents(
            @RequestParam String searchTerm) {
        return ResponseEntity.ok(schoolService.searchStudents(searchTerm));
    }
*/
    @PostMapping("/students/filter")
    public ResponseEntity<List<Map<String, Object>>> filterStudents(
            @RequestBody StudentFilterDTO filterDTO) {
        return ResponseEntity.ok(schoolService.filterStudents(filterDTO));
    }

    //Single record endpoints
    @GetMapping("/students/{id}")
    public ResponseEntity<List<Map<String, Object>>> getStudentById(@PathVariable int id) {
        List<Map<String, Object>> student = schoolService.getStudentById(id);
        return !student.isEmpty() ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }

    @GetMapping("/students/admissionnumber/{admissionNumber}")
    public ResponseEntity<List<Map<String, Object>>> getStudentByAdmissionNumber(@PathVariable String admissionNumber) {
        List<Map<String, Object>> student = schoolService.getStudentByAdmissionNumber(admissionNumber);
        return !student.isEmpty() ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }

    @GetMapping("/classes/{id}")
    public ResponseEntity<List<Map<String, Object>>> getClassById(@PathVariable int id) {
        List<Map<String, Object>> classes = schoolService.getClassById(id);
        return !classes.isEmpty() ? ResponseEntity.ok(classes) : ResponseEntity.notFound().build();
    }

    @GetMapping("/streams/{id}")
    public ResponseEntity<List<Map<String, Object>>> getStreamById(@PathVariable int id) {
        List<Map<String, Object>> streams = schoolService.getStreamById(id);
        return !streams.isEmpty() ? ResponseEntity.ok(streams) : ResponseEntity.notFound().build();
    }
}