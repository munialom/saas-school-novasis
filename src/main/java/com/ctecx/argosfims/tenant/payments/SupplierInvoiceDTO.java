package com.ctecx.argosfims.tenant.payments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierInvoiceDTO {

    private String invoiceNumber;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private BigDecimal amount;
    private String description;
    private String supplier;
    private Integer expenseAccount;
    private Integer fundingAccount;
    private String status;

}