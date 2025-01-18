
package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountGroup;
import com.ctecx.argosfims.tenant.config.TenantJdbcTemplateConfig;
import com.ctecx.argosfims.tenant.payments.PaymentVoucherDTO;
import com.ctecx.argosfims.tenant.payments.PaymentVoucherTable;
import com.ctecx.argosfims.tenant.payments.PaymentVoucherTableRepository;
import com.ctecx.argosfims.tenant.suppliers.Supplier;
import com.ctecx.argosfims.tenant.suppliers.SupplierRepository;
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
public class PaymentVoucherProcessor {
    private final AccountingEntryRecorder entryRecorder;
    private final SupplierRepository supplierRepository;
    private final TenantJdbcTemplateConfig tenantJdbcTemplateConfig;
    private final PaymentVoucherTableRepository paymentVoucherTableRepository; // Added repository for PaymentVouchersTable

    private JdbcTemplate getJdbcTemplate(){
        return tenantJdbcTemplateConfig.getTenantJdbcTemplate();
    }

    public void processPaymentVoucher(PaymentVoucherDTO voucher) {
        log.info("Processing payment voucher: {}", voucher.getVoucherNumber());
        validateVoucher(voucher);

        AccountChart expenseAccount = getAccountChart(Long.valueOf(voucher.getExpenseAccount()), "Expense Account");
        AccountChart fundingAccount = getAccountChart(Long.valueOf(voucher.getFundingAccount()), "Funding Account");

        Supplier supplierData = null;
        if (voucher.getVoucherType().equals("supplier")) {
            supplierData = supplierRepository.findById(Long.valueOf(voucher.getSupplier()))
                    .orElseThrow(() -> new NoSuchElementException("Supplier not found for ID: " + voucher.getSupplier()));
        }


        List<AccountingEntryItem> items = new ArrayList<>();
        String module = "Imprest Voucher";

        if (voucher.getVoucherType().equals("imprest")) {
            // Debit expense account
            items.add(AccountingEntryItem.builder()
                    .accountName(expenseAccount.getName())
                    .isDebit(true)
                    .amount(voucher.getAmount())
                    .build());
            //Credit Imprest account
            items.add(AccountingEntryItem.builder()
                    .accountName(fundingAccount.getName())
                    .isDebit(false)
                    .amount(voucher.getAmount())
                    .build());

        } else if (voucher.getVoucherType().equals("supplier")) {
            module = "Supplier Payment";
            // Debit expense account (direct payment to supplier)
            items.add(AccountingEntryItem.builder()
                    .accountName(expenseAccount.getName())
                    .isDebit(true)
                    .amount(voucher.getAmount())
                    .build());
            // Credit bank account
            items.add(AccountingEntryItem.builder()
                    .accountName(fundingAccount.getName())
                    .isDebit(false)
                    .amount(voucher.getAmount())
                    .build());
        }

        entryRecorder.recordEntry(
                voucher.getVoucherDate(),
                voucher.getDescription(),
                "Cheque",
                module,
                items,
                voucher.getVoucherType().equals("imprest") ? voucher.getPayee() : supplierData.getSupplierName()
        );

        // Create and save record in PaymentVouchersTable
        savePaymentVoucherRecord(voucher, expenseAccount, fundingAccount, supplierData);


        log.info("Successfully processed payment voucher: {}", voucher.getVoucherNumber());
    }

    private void savePaymentVoucherRecord(PaymentVoucherDTO voucher, AccountChart expenseAccount, AccountChart fundingAccount, Supplier supplierData) {
        PaymentVoucherTable paymentVoucherRecord = new PaymentVoucherTable();
        paymentVoucherRecord.setVoucherNumber(voucher.getVoucherNumber());
        paymentVoucherRecord.setVoucherDate(voucher.getVoucherDate());
        paymentVoucherRecord.setDescription(voucher.getDescription());
        paymentVoucherRecord.setVoucherType(voucher.getVoucherType());
        paymentVoucherRecord.setAmount(voucher.getAmount());
        paymentVoucherRecord.setExpenseAccountId(expenseAccount.getId());
        paymentVoucherRecord.setFundingAccountId(fundingAccount.getId());
        paymentVoucherRecord.setPayee(voucher.getVoucherType().equals("imprest") ? voucher.getPayee() : (supplierData != null ? supplierData.getSupplierName() : null));
        paymentVoucherTableRepository.save(paymentVoucherRecord);

        log.info("Payment voucher record saved to PaymentVouchersTable for voucher number: {}", voucher.getVoucherNumber());
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


    private void validateVoucher(PaymentVoucherDTO voucher) {

        if (voucher == null) {
            throw new IllegalArgumentException("Payment voucher cannot be null");
        }
        if (voucher.getVoucherDate() == null) {
            throw new IllegalArgumentException("Payment date cannot be null");
        }
        if (voucher.getAmount() == null || voucher.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment Amount must be positive");
        }
        if (voucher.getVoucherType() == null || (!voucher.getVoucherType().equals("imprest") && !voucher.getVoucherType().equals("supplier"))) {
            throw new IllegalArgumentException("Voucher type must be 'imprest' or 'supplier'");
        }
        if (voucher.getVoucherType().equals("imprest") && (voucher.getPayee() == null || voucher.getPayee().trim().isEmpty())) {
            throw new IllegalArgumentException("Payee must be provided for 'imprest' payment");
        }

    }
}