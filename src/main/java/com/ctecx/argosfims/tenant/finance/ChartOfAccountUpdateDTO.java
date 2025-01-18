package com.ctecx.argosfims.tenant.finance;



import lombok.Data;

@Data
public class ChartOfAccountUpdateDTO {
    private int id;
    private String accountName;
    private boolean isBankAccount;
    private boolean accountStatus;

}