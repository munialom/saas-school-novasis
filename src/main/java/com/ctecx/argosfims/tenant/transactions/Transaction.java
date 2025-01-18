package com.ctecx.argosfims.tenant.transactions;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.students.Student;
import com.ctecx.argosfims.util.AuditableBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction extends AuditableBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "class_id")
    private Integer studentClass;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "account_chart_id")
    private AccountChart accountChart;

    private String className;
    private String admission_number;
    private String module;
    private String description;
    private BigDecimal credit;
    private BigDecimal debit;

    private BigDecimal amount;
    private String status;


    private LocalDate transactionDate;

    private String mode;
    private String serialNumber;
    private String streamName;
    private String studentName;
    private String accountName;
    private String accountType;
    private String paymentRef;


    private LocalDate bankingDate;
    private String bankName;
    private String parentName;
    private String term;
    private String party;
    private String partyId;
    private boolean deleted;
    private String transactionType;
}