package com.ctecx.argosfims.tenant.chartofaccounts;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountChartRequest {
    @NotBlank(message = "Account name cannot be blank")
    @Size(max = 128, message = "Account name cannot exceed 128 characters")
    private String name;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 128, message = "Description cannot exceed 128 characters")
    private String alias;

    private Integer parentId;

    @NotNull(message = "Account group cannot be null")
    private AccountGroup accountGroup;

    private String accountGroupText;

    private String parentGroup;

    private boolean bankAccount;
    private Integer linkedBankAccountId;
    private Integer receivableAccountId;
    private boolean receivable;
    private boolean payable;
}