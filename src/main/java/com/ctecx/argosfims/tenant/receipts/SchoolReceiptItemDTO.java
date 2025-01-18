package com.ctecx.argosfims.tenant.receipts;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SchoolReceiptItemDTO {
    private int index;
    private String accountName;
    private String accountDescription;
    private double paymentForAccount;
}