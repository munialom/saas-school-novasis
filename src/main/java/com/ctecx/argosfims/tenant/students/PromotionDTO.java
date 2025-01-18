package com.ctecx.argosfims.tenant.students;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionDTO {
    private Integer currentClassId;
    private Integer nextClassId;
    private String opcode;
}