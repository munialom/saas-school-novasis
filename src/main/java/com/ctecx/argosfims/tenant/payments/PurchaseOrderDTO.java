package com.ctecx.argosfims.tenant.payments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderDTO {

    private String poNumber;
    private LocalDate poDate;
    private String notes;
    private String supplier;
    private List<PurchaseOrderItemDTO> items;
    private String status;
}