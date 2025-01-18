// UserRoleService.java
package com.ctecx.argosfims.tenant.userroles;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;

    public UserRole createUserRole(UserRoleDTO userRoleDTO) {
        // Check if a role with the given name already exists
        Optional<UserRole> existingRole = userRoleRepository.findByRoleName(userRoleDTO.getRoleName());
        if (existingRole.isPresent()) {
            throw new IllegalStateException("A role with name '" + userRoleDTO.getRoleName() + "' already exists.");
        }

        UserRole userRole = new UserRole();
        userRole.setRoleName(userRoleDTO.getRoleName());
        userRole.setRoleDescription(userRoleDTO.getRoleDescription());

        return userRoleRepository.save(userRole);
    }
    public UserRole getUserRoleById(Long id) {
        return userRoleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User role with id " + id + " not found"));
    }

    public List<UserRole> getAllUserRoles() {
        return userRoleRepository.findAll();
    }
}