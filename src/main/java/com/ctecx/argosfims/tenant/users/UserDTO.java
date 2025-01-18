package com.ctecx.argosfims.tenant.users;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {

    @NotBlank(message = "Full name cannot be blank")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Gender cannot be blank")
    @Size(max = 10, message = "Gender cannot exceed 10 characters")
    private String gender;

    @NotBlank(message = "Username cannot be blank")
    @Size(max = 50, message = "Username cannot exceed 50 characters")
    private String userName;

    @NotBlank(message = "Password cannot be blank")
    @Size(max = 100, message = "Password cannot exceed 100 characters")
    private String password;

    @NotBlank(message = "Status cannot be blank")
    @Size(max = 10, message = "Status cannot exceed 10 characters")
    private String status;

    private boolean enabled;

    private Set<Long> roleIds;
}