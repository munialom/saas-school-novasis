package com.ctecx.argosfims.tenant.students;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/promotion")
public class StudentPromotionController {

    private static final Logger log = LoggerFactory.getLogger(StudentPromotionController.class);

    private final StudentPromotionService studentPromotionService;

    public StudentPromotionController(StudentPromotionService studentPromotionService) {
        this.studentPromotionService = studentPromotionService;
    }

    @PostMapping("/promote")
    public ResponseEntity<String> promoteStudents(@Valid @RequestBody PromotionDTO promotionDTO) {
        log.info("Received promotion request: {}", promotionDTO);
        try {
            studentPromotionService.promoteStudents(promotionDTO);
            return ResponseEntity.ok("Students promoted successfully.");
        } catch (EntityNotFoundException ex) {
            log.error("Entity not found during promotion: {}", ex.getMessage());
            throw ex; // Re-throw to be handled by the exception handler
        } catch (IllegalArgumentException ex) {
            log.error("Invalid argument during promotion: {}", ex.getMessage());
            throw ex; // Re-throw to be handled by the exception handler
        } catch (Exception ex) {
            log.error("An unexpected error occurred during promotion: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred during student promotion.");
        }
    }

  /*  @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFoundException(EntityNotFoundException ex) {
        log.warn("Handling EntityNotFoundException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Handling IllegalArgumentException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        log.warn("Handling IllegalStateException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }*/
}