/*
package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountGroup;
import com.ctecx.argosfims.tenant.config.TenantJdbcTemplateConfig;
import com.ctecx.argosfims.tenant.payments.SupplierInvoiceDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Component
@AllArgsConstructor
public class SupplierInvoiceProcessor {
    private final AccountingEntryRecorder entryRecorder;
    private final TenantJdbcTemplateConfig tenantJdbcTemplateConfig;

    private JdbcTemplate getJdbcTemplate(){
        return tenantJdbcTemplateConfig.getTenantJdbcTemplate();
    }


    public void processSupplierInvoice(SupplierInvoiceDTO invoice) {
        log.info("Processing supplier invoice: {}", invoice.getInvoiceNumber());
        validateInvoice(invoice);
        AccountChart expenseAccount = getAccountChart(Long.valueOf(invoice.getExpenseAccount()), "Expense Account");
        AccountChart payableAccount = getAccountChart(Long.valueOf(invoice.getFundingAccount()), "Payable Account");
        List<AccountingEntryItem> items = new ArrayList<>();

        // Debit expense account
        items.add(AccountingEntryItem.builder()
                .accountName(expenseAccount.getName())
                .isDebit(true)
                .amount(invoice.getAmount())
                .build());

        // Credit Accounts Payable
        items.add(AccountingEntryItem.builder()
                .accountName(payableAccount.getName())
                .isDebit(false)
                .amount(invoice.getAmount())
                .build());


        entryRecorder.recordEntry(
                invoice.getInvoiceDate(),
                invoice.getDescription(),
                "Credit",
                "Supplier Invoice",
                items,
                invoice.getSupplier()
        );

        log.info("Successfully processed supplier invoice: {}", invoice.getInvoiceNumber());
    }


    private AccountChart getAccountChart(Long accountId, String accountType) {
        String sql = "SELECT id, account_name, account_code, account_group_enum FROM chartofaccounts WHERE id = ?";
        try {
            return getJdbcTemplate().queryForObject(sql, new Object[]{accountId}, (rs, rowNum) -> {
                AccountChart accountChart = new AccountChart();
                accountChart.setId(rs.getInt("id"));
                accountChart.setName(rs.getString("account_name"));
                accountChart.setAccountCode(rs.getInt("account_code"));
                accountChart.setAccountGroupEnum(AccountGroup.valueOf(rs.getString("account_group_enum")));
                return accountChart;
            });
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw new NoSuchElementException(accountType + " not found for ID: " + accountId);
        }
    }


    private void validateInvoice(SupplierInvoiceDTO invoice) {
        if (invoice == null) {
            throw new IllegalArgumentException("Supplier invoice cannot be null");
        }
        if(invoice.getInvoiceDate() == null){
            throw new IllegalArgumentException("Invoice date cannot be null");
        }
        if(invoice.getAmount() == null || invoice.getAmount().compareTo(java.math.BigDecimal.ZERO)<=0){
            throw new IllegalArgumentException("Invoice Amount must be positive");
        }
        if (invoice.getSupplier() == null || invoice.getSupplier().trim().isEmpty()) {
            throw new IllegalArgumentException("Supplier must be provided for 'supplier' payment");
        }


    }
}*/


package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountGroup;
import com.ctecx.argosfims.tenant.config.TenantJdbcTemplateConfig;
import com.ctecx.argosfims.tenant.payments.SupplierInvoiceDTO;
import com.ctecx.argosfims.tenant.payments.SupplierInvoiceTable;
import com.ctecx.argosfims.tenant.payments.SupplierInvoiceTableRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Component
@AllArgsConstructor
public class SupplierInvoiceProcessor {
    private final AccountingEntryRecorder entryRecorder;
    private final TenantJdbcTemplateConfig tenantJdbcTemplateConfig;
    private final SupplierInvoiceTableRepository supplierInvoiceTableRepository; // Added repository for SupplierInvoicesTable

    private JdbcTemplate getJdbcTemplate(){
        return tenantJdbcTemplateConfig.getTenantJdbcTemplate();
    }


    public void processSupplierInvoice(SupplierInvoiceDTO invoice) {
        log.info("Processing supplier invoice: {}", invoice.getInvoiceNumber());
        validateInvoice(invoice);
        AccountChart expenseAccount = getAccountChart(Long.valueOf(invoice.getExpenseAccount()), "Expense Account");
        AccountChart payableAccount = getAccountChart(Long.valueOf(invoice.getFundingAccount()), "Payable Account");
        List<AccountingEntryItem> items = new ArrayList<>();

        // Debit expense account
        items.add(AccountingEntryItem.builder()
                .accountName(expenseAccount.getName())
                .isDebit(true)
                .amount(invoice.getAmount())
                .build());

        // Credit Accounts Payable
        items.add(AccountingEntryItem.builder()
                .accountName(payableAccount.getName())
                .isDebit(false)
                .amount(invoice.getAmount())
                .build());


        entryRecorder.recordEntry(
                invoice.getInvoiceDate(),
                invoice.getDescription(),
                "Credit",
                "Supplier Invoice",
                items,
                invoice.getSupplier()
        );

        // Create and save record in SupplierInvoicesTable
        saveSupplierInvoiceRecord(invoice, expenseAccount, payableAccount);

        log.info("Successfully processed supplier invoice: {}", invoice.getInvoiceNumber());
    }

    private void saveSupplierInvoiceRecord(SupplierInvoiceDTO invoice, AccountChart expenseAccount, AccountChart payableAccount) {
        SupplierInvoiceTable supplierInvoiceRecord = new SupplierInvoiceTable();
        supplierInvoiceRecord.setInvoiceNumber(invoice.getInvoiceNumber());
        supplierInvoiceRecord.setInvoiceDate(invoice.getInvoiceDate());
        supplierInvoiceRecord.setDescription(invoice.getDescription());
        supplierInvoiceRecord.setAmount(invoice.getAmount());
        supplierInvoiceRecord.setExpenseAccountId(expenseAccount.getId());
        supplierInvoiceRecord.setPayableAccountId(payableAccount.getId());
        supplierInvoiceRecord.setSupplier(invoice.getSupplier());
        supplierInvoiceTableRepository.save(supplierInvoiceRecord);

        log.info("Supplier invoice record saved to SupplierInvoicesTable for invoice number: {}", invoice.getInvoiceNumber());
    }



    private AccountChart getAccountChart(Long accountId, String accountType) {
        String sql = "SELECT id, account_name, account_code, account_group_enum FROM chartofaccounts WHERE id = ?";
        try {
            return getJdbcTemplate().queryForObject(sql, new Object[]{accountId}, (rs, rowNum) -> {
                AccountChart accountChart = new AccountChart();
                accountChart.setId(rs.getInt("id"));
                accountChart.setName(rs.getString("account_name"));
                accountChart.setAccountCode(rs.getInt("account_code"));
                accountChart.setAccountGroupEnum(AccountGroup.valueOf(rs.getString("account_group_enum")));
                return accountChart;
            });
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw new NoSuchElementException(accountType + " not found for ID: " + accountId);
        }
    }


    private void validateInvoice(SupplierInvoiceDTO invoice) {
        if (invoice == null) {
            throw new IllegalArgumentException("Supplier invoice cannot be null");
        }
        if(invoice.getInvoiceDate() == null){
            throw new IllegalArgumentException("Invoice date cannot be null");
        }
        if(invoice.getAmount() == null || invoice.getAmount().compareTo(java.math.BigDecimal.ZERO)<=0){
            throw new IllegalArgumentException("Invoice Amount must be positive");
        }
        if (invoice.getSupplier() == null || invoice.getSupplier().trim().isEmpty()) {
            throw new IllegalArgumentException("Supplier must be provided for 'supplier' payment");
        }


    }
}