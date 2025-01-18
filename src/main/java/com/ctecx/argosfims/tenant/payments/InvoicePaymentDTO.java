package com.ctecx.argosfims.tenant.payments;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoicePaymentDTO {
    private LocalDate paymentDate;
    private BigDecimal amount;
    private String paymentAccount;
    private String description;
    private String supplier;
    private String invoiceNumber;
}