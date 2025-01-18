package com.ctecx.argosfims.tenant.receipts;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SchoolReceiptSummaryDTO {
    private double amountPaid;
    private double balance;
}