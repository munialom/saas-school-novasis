package com.ctecx.argosfims.tenant.school;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentUpdateDTO {
    private Long id;
    private String admissionNumber;
    private String fullName;
    private String gender;
    private String location;
    private String admission;
    private String mode;
    private Boolean status;
    private Integer yearOf;
    private Integer classId;
    private Integer streamId;
}