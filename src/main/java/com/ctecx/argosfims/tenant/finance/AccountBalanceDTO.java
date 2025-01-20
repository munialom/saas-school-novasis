package com.ctecx.argosfims.tenant.finance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountBalanceDTO {
    private int id;
    private String accountName;
    private double balance;
}