package com.ctecx.argosfims.tenant.receipts;

import java.math.BigDecimal;
import java.util.Date;

public class PaymentVoucherDTO {

    private String voucherNumber;
    private Date voucherDate;
    private String voucherType;
    private String payee;
    private String voucherDescription;
    private BigDecimal amount;
    private String expenseAccountName;
    private String fundingAccountName;

    public PaymentVoucherDTO() {
    }
    public PaymentVoucherDTO(String voucherNumber, Date voucherDate, String voucherType, String payee, String voucherDescription, BigDecimal amount, String expenseAccountName, String fundingAccountName) {
        this.voucherNumber = voucherNumber;
        this.voucherDate = voucherDate;
        this.voucherType = voucherType;
        this.payee = payee;
        this.voucherDescription = voucherDescription;
        this.amount = amount;
        this.expenseAccountName = expenseAccountName;
        this.fundingAccountName = fundingAccountName;
    }

    public String getVoucherNumber() {
        return voucherNumber;
    }

    public void setVoucherNumber(String voucherNumber) {
        this.voucherNumber = voucherNumber;
    }

    public Date getVoucherDate() {
        return voucherDate;
    }

    public void setVoucherDate(Date voucherDate) {
        this.voucherDate = voucherDate;
    }

    public String getVoucherType() {
        return voucherType;
    }

    public void setVoucherType(String voucherType) {
        this.voucherType = voucherType;
    }

    public String getPayee() {
        return payee;
    }

    public void setPayee(String payee) {
        this.payee = payee;
    }

    public String getVoucherDescription() {
        return voucherDescription;
    }

    public void setVoucherDescription(String voucherDescription) {
        this.voucherDescription = voucherDescription;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getExpenseAccountName() {
        return expenseAccountName;
    }

    public void setExpenseAccountName(String expenseAccountName) {
        this.expenseAccountName = expenseAccountName;
    }

    public String getFundingAccountName() {
        return fundingAccountName;
    }

    public void setFundingAccountName(String fundingAccountName) {
        this.fundingAccountName = fundingAccountName;
    }
}