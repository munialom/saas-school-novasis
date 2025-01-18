package com.ctecx.argosfims.tenant.userroles;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRoleDTO {

    @NotBlank(message = "Role name cannot be blank")
    @Size(max = 50, message = "Role name cannot exceed 50 characters")
    private String roleName;

    @Size(max = 255, message = "Role description cannot exceed 255 characters")
    private String roleDescription;

}