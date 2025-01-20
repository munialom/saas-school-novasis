package com.ctecx.argosfims.tenant.chartofaccounts;

import com.ctecx.argosfims.util.AuditableBase;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chartofaccounts")
public class AccountChart extends AuditableBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 128, nullable = false, unique = true, name = "account_name")
    private String name;

    @Column(length = 128, nullable = false, name = "description")
    private String alias;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private AccountChart parent;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_group_enum", nullable = false)
    private AccountGroup accountGroupEnum;

    @Column(name = "account_group", nullable = false)
    private String accountGroup;

    @Column(name = "parent_group", nullable = false)
    private String parentGroup;

    @Column(name = "account_code", nullable = false, unique = true)
    private int accountCode;

    @Column(name = "is_bank_account")
    private boolean bankAccount;

    @OneToOne
    @JoinColumn(name = "linked_receivable_account_id")
    private AccountChart receivableAccount;

    @ManyToOne
    @JoinColumn(name = "linked_bank_account_id")
    private AccountChart linkedBankAccount;


    @Column(name = "currency_code", length = 3)
    private String currencyCode;

    private boolean status;

    private boolean receivable;
    private boolean payable;
    private boolean defaultOverpaymentsAccount;


}