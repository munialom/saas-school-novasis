package com.ctecx.argosfims.tenant.payments;



import com.ctecx.argosfims.util.AuditableBase;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "payment_vouchers")
@Data
public class PaymentVoucherTable extends AuditableBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "voucher_number")
    private String voucherNumber;
    @Column(name = "voucher_date")
    private LocalDate voucherDate;
    @Column(name = "description")
    private String description;
    @Column(name = "voucher_type")
    private String voucherType;
    @Column(name = "amount")
    private BigDecimal amount;
    @Column(name = "expense_account_id")
    private Integer expenseAccountId;
    @Column(name = "funding_account_id")
    private Integer fundingAccountId;
    @Column(name = "payee")
    private String payee;

}