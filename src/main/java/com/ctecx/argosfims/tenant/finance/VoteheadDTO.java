package com.ctecx.argosfims.tenant.finance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteheadDTO {
    private String name;
    private double initialCost;
    private double paidAmount;


}