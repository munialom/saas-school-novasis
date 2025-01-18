package com.ctecx.argosfims.tenant.chartofaccounts;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountChartResponse {
    private Integer id;
    private String name;
    private String alias;
    private Integer parentId;
    private AccountGroup accountGroup;
    private String accountGroupText;
    private String parentGroup;
    private int accountCode;
    private boolean bankAccount;
    private Integer linkedBankAccountId;
    private String currencyCode;
    private boolean status;
}