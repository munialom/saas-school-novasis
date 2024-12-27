package com.ctecx.argosfims.util;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserAudit {
    private Long userId;
    private String userName;
    private String fullName;
}