package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChartService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@AllArgsConstructor
public class RevenueProcessor {
    private final AccountingEntryRecorder entryRecorder;
    private final AccountChartService accountChartService;

    public void recordDonation(LocalDate date, BigDecimal amount, String description,String fundingAccount, Object donor) {
        recordRevenue(date,amount,description,fundingAccount,AccountConstants.DEFAULT_DONATION_REVENUE,donor, "Donation");
    }

    public void recordGrant(LocalDate date, BigDecimal amount, String description,String fundingAccount, Object grantor) {
        recordRevenue(date,amount,description,fundingAccount,AccountConstants.DEFAULT_GRANT_REVENUE, grantor, "Grant");
    }

    private void recordRevenue(LocalDate date, BigDecimal amount, String description, String fundingAccount, String revenueAccount, Object party,String module) {
        log.info("Recording revenue: {} of amount: {}", description, amount);
        validateRevenueDetails(date,amount,fundingAccount, revenueAccount);
        List<AccountingEntryItem> items = new ArrayList<>();

        // Credit revenue account
        items.add(AccountingEntryItem.builder()
                .accountName(revenueAccount)
                .isDebit(false)
                .amount(amount)
                .build());


        // Debit bank Account account
        items.add(AccountingEntryItem.builder()
                .accountName(fundingAccount)
                .isDebit(true)
                .amount(amount)
                .build());

        entryRecorder.recordEntry(
                date,
                description,
                "Bank Deposit",
                module,
                items,
                party
        );
        log.info("Successfully recorded {} transaction for amount: {}", module, amount);
    }
    private void validateRevenueDetails(LocalDate date, BigDecimal amount, String fundingAccount, String revenueAccount){
        if (date == null) {
            throw new IllegalArgumentException("Date cannot be null");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (fundingAccount == null || fundingAccount.trim().isEmpty()) {
            throw new IllegalArgumentException("Funding account cannot be null or empty");
        }
        if (revenueAccount == null || revenueAccount.trim().isEmpty()) {
            throw new IllegalArgumentException("Revenue account cannot be null or empty");
        }
        if(accountChartService.getAccountByName(fundingAccount)== null){
            throw new IllegalArgumentException("Invalid Funding Account");
        }
        if(accountChartService.getAccountByName(revenueAccount)== null){
            throw new IllegalArgumentException("Invalid Revenue Account");
        }
    }
}