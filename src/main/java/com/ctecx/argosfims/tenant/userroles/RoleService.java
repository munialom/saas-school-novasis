package com.ctecx.argosfims.tenant.userroles;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }


    public void createRole(UserRole userRole) {

        roleRepository.save(userRole);
    }
    public UserRole createRoles(UserRole userRole) {

       return roleRepository.save(userRole);
    }

    public List<UserRole> roleList() {

        return (List<UserRole>) roleRepository.findAll();
    }

    public Set<UserRole> getRoleByName(String rName) {
        return roleRepository.findByRoleName(rName);
    }

    public Page<UserRole> getAllRolesPaged(PageRequest pageRequest) {
        return roleRepository.findAll(pageRequest);
    }
    public void deleteRole(Integer id) {
        roleRepository.deleteById(Long.valueOf(id));
    }
}
