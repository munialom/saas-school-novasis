package com.ctecx.argosfims.tenant.transactions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentFeePaymentRequest {

    private int accountId;
    private String accountName;
    private double balance;
    private double amount;
}