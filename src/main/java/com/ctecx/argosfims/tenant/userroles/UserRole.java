// UserRole.java
package com.ctecx.argosfims.tenant.userroles;



import com.ctecx.argosfims.tenant.users.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles")
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "role_name", length = 50, nullable = false)
    private String roleName;

    @Column(name = "role_description", length = 255)
    private String roleDescription;

    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();
}