package com.ctecx.argosfims.tenant.userroles;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
public class RoleRestController {

    private  final RoleService roleService;




    @PostMapping
    public ResponseEntity<UserRole> createRole(@RequestBody UserRole userRole) {
        UserRole createdUserRole = roleService.createRoles(userRole);
        return new ResponseEntity<>(createdUserRole, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
