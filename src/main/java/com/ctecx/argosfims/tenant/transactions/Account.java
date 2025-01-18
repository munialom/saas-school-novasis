package com.ctecx.argosfims.tenant.transactions;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class Account {
    private int id;
    private String accountCode;
    private String accountName;
    private BigDecimal amount;
}