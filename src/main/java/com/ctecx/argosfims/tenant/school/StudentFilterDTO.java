package com.ctecx.argosfims.tenant.school;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentFilterDTO {
    private String className;
    private String streamName;
    private Boolean status;
    private Integer yearOf;
    private String admission;
    private String mode;
}