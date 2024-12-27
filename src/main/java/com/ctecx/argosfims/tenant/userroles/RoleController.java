package com.ctecx.argosfims.tenant.userroles;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;

    }

    @GetMapping
    public String registerUserRoles(Model model){

        model.addAttribute("roleUser", new UserRole());
        model.addAttribute("rolesData",roleService.roleList());

        return "configs/addRole";
    }



    @PostMapping
    public String saveUserRoles(UserRole userRole){

        roleService.createRole(userRole);
        return "redirect:/configs";
    }

}
