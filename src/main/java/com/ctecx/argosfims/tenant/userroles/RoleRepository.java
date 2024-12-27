package com.ctecx.argosfims.tenant.userroles;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface RoleRepository extends JpaRepository<UserRole,Long> {

    //List<UserRole> findByRoleName(String roleName);
    Set<UserRole> findByRoleName(String roleName);
}
