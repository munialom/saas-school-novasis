package com.ctecx.argosfims.tenant.payments;

import com.ctecx.argosfims.util.AuditableBase;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "supplier_invoices")
@Data
public class SupplierInvoiceTable extends AuditableBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "invoice_number")
    private String invoiceNumber;
    @Column(name = "invoice_date")
    private LocalDate invoiceDate;
    @Column(name = "description")
    private String description;
    @Column(name = "amount")
    private BigDecimal amount;
    @Column(name = "expense_account_id")
    private Integer expenseAccountId;
    @Column(name = "payable_account_id")
    private Integer payableAccountId;
    @Column(name = "supplier")
    private String supplier;

}