package com.ctecx.argosfims.tenant.payments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVoucherDTO {

    private String voucherNumber;
    private LocalDate voucherDate;
    private String voucherType; // "imprest" or "supplier"
    private String payee; // Only for "imprest" payments
    private Integer supplier;
    private BigDecimal amount;
    private Integer expenseAccount;
    private Integer fundingAccount;
    private String checkNumber; // Optional, for supplier payment type
    private String description;
}

