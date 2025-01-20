
package com.ctecx.argosfims.tenant.transactions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Integer studentId;
    private LocalDate bankingDate;
    private LocalDate paymentDate;
    private String payMode;
    private String term;
    private String ref;
    private Integer bankId;
    private List<StudentFeePaymentRequest> studentFeePaymentRequests;
    private boolean manualAllocation;
    private Double amountPaid; // Add amountPaid field
}