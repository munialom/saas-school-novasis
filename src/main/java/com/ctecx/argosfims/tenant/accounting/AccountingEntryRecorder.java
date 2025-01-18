package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountChartService;
import com.ctecx.argosfims.tenant.transactions.Transaction;
import com.ctecx.argosfims.tenant.utils.TransactionHelper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@AllArgsConstructor
public class AccountingEntryRecorder {
    private final AccountChartService accountChartService;
    private final NonProfitAccountingSystem accountingSystem;

    public void recordEntry(LocalDate date, String description, String paymentMode, String module,
                            List<AccountingEntryItem> items, Object party) {
        log.info("Recording accounting entry for: {}, module :{}, items: {}, party: {}", description, module, items, party);
        List<TransactionHelper.TransactionEntry> entries = items.stream()
                .map(item -> {
                    AccountChart account = accountChartService.getAccountByName(item.getAccountName().trim());
                    if (account == null) {
                        String errorMessage = "Account not found: " + item.getAccountName();
                        log.error(errorMessage);
                        throw new RuntimeException(errorMessage);
                    }
                    return new TransactionHelper.TransactionEntry(account, item.isDebit(), item.getAmount());
                })
                .collect(Collectors.toList());

        try {

            List<Transaction> transactions =
                    TransactionHelper.createBalancedTransaction(date, description, paymentMode, module, entries, party);
            if (!transactions.isEmpty()) {
                accountingSystem.recordTransactions(transactions);
                log.info("Successfully recorded {} transactions for {}, voucher number: {}, module: {}",
                        transactions.size(), description, transactions.get(0).getSerialNumber(), module);
            } else {
                log.warn("No transactions created for {} (possibly due to zero amounts)", description);
            }
        } catch (Exception e) {
            String errorMessage = "Error recording transactions for: " + description + ": " + e.getMessage();
            log.error(errorMessage, e);
            throw new RuntimeException("Failed to record transactions", e);
        }
    }
}