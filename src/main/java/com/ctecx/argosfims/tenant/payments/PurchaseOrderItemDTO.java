package com.ctecx.argosfims.tenant.payments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
class PurchaseOrderItemDTO {
    private String item;
    private int quantity;
    private BigDecimal unitPrice;
    private LocalDate deliveryDate;
}