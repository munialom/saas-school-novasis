package com.ctecx.argosfims.tenant.school;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassUpdateDTO {
    private Integer id;
    private String className;
    private Boolean status;
}