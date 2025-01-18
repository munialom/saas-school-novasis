package com.ctecx.argosfims.tenant.receipts;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class ReceiptDetailsDTO {
    private String bankName;
    private Date bankingDate;
    private String paymentMode;
    private String transactionRefNo;
}