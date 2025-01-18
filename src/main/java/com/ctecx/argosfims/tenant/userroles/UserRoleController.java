// UserRoleController.java
package com.ctecx.argosfims.tenant.userroles;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-roles")
@RequiredArgsConstructor
public class UserRoleController {

    private final UserRoleService userRoleService;

    @PostMapping
    public ResponseEntity<UserRole> createUserRole(@Valid @RequestBody UserRoleDTO userRoleDTO) {
        UserRole savedRole = userRoleService.createUserRole(userRoleDTO);
        return new ResponseEntity<>(savedRole, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserRole> getUserRoleById(@PathVariable Long id) {
        UserRole userRole = userRoleService.getUserRoleById(id);
        return new ResponseEntity<>(userRole, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<UserRole>> getAllUserRoles() {
        List<UserRole> userRoleList = userRoleService.getAllUserRoles();
        return new ResponseEntity<>(userRoleList, HttpStatus.OK);
    }


    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleRoleException(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFoundException(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}