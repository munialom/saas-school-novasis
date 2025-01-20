package com.ctecx.argosfims.tenant.ipns;


import com.ctecx.argosfims.util.AuditableBase;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "ipn_transactions")
public class IPNTransaction extends AuditableBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String transactionReference;
    private String requestId;
    private String channelCode;
    private String timestamp;
    private BigDecimal transactionAmount;
    private String currency;
    private String customerReference;
    private String customerName;
    private String customerMobileNumber;
    private BigDecimal balance;
    private String narration;
    private String creditAccountIdentifier;
    private String organizationShortCode;
    private String tillNumber;
    @Enumerated(EnumType.STRING)
    private MpesaTransactionState transactionState;
}