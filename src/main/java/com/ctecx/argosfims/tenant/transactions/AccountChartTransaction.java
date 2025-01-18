package com.ctecx.argosfims.tenant.transactions;

import lombok.Data;



@Data
public class AccountChartTransaction {
    private Integer id;
    private Integer accountCode;
    private String name;
    private String accountGroup;
    private String parentGroup;
    private boolean isBankAccount; // Added field for Bank Account status
}