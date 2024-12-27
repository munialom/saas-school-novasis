// User.java
package com.ctecx.argosfims.tenant.users;



import com.ctecx.argosfims.tenant.userroles.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tbl_user")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Size(max = 100)
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Size(max = 10)
    @Column(name = "gender", nullable = false, length = 10)
    private String gender;

    @Size(max = 50)
    @Column(name = "user_name", nullable = false, unique = true, length = 50)
    private String userName;

    @Size(max = 100)
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Size(max = 10)
    @Column(name = "status", nullable = false, length = 10)
    private String status;

    private boolean enabled;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<UserRole> roles = new HashSet<>();
}