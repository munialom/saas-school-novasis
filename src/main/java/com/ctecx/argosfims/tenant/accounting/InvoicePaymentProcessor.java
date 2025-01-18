package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChartService;
import com.ctecx.argosfims.tenant.payments.InvoicePaymentDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static com.ctecx.argosfims.tenant.accounting.AccountConstants.DEFAULT_ACCOUNTS_PAYABLE;


@Slf4j
@Component
@AllArgsConstructor
public class InvoicePaymentProcessor {
    private final AccountingEntryRecorder entryRecorder;
    private final AccountChartService accountChartService;

    public void processInvoicePayment(InvoicePaymentDTO payment) {
        log.info("Processing Invoice payment for invoice: {}", payment.getInvoiceNumber());
        validateInvoicePayment(payment);
        List<AccountingEntryItem> items = new ArrayList<>();
        String module = "Supplier Invoice Payment";

        // Debit accounts payable
        items.add(AccountingEntryItem.builder()
                .accountName(DEFAULT_ACCOUNTS_PAYABLE)
                .isDebit(true)
                .amount(payment.getAmount())
                .build());
        // Credit bank account
        items.add(AccountingEntryItem.builder()
                .accountName(payment.getPaymentAccount())
                .isDebit(false)
                .amount(payment.getAmount())
                .build());

        entryRecorder.recordEntry(
                payment.getPaymentDate(),
                payment.getDescription(),
                "Cheque",
                module,
                items,
                payment.getSupplier()
        );

        log.info("Successfully processed payment for invoice: {}", payment.getInvoiceNumber());
    }

    private void validateInvoicePayment(InvoicePaymentDTO payment) {
        if (payment == null) {
            throw new IllegalArgumentException("Invoice payment cannot be null");
        }
        if (payment.getPaymentDate() == null) {
            throw new IllegalArgumentException("Payment date cannot be null");
        }
        if (payment.getAmount() == null || payment.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment Amount must be positive");
        }
        if (payment.getSupplier() == null || payment.getSupplier().trim().isEmpty()) {
            throw new IllegalArgumentException("Supplier must be provided for 'supplier' payment");
        }
        if (payment.getPaymentAccount() == null || payment.getPaymentAccount().trim().isEmpty()) {
            throw new IllegalArgumentException("Payment Account cannot be null or empty");
        }
        if(accountChartService.getAccountByName(payment.getPaymentAccount()) == null){
            throw new IllegalArgumentException("Invalid payment account");
        }
        if (payment.getInvoiceNumber() == null || payment.getInvoiceNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Invoice number must be provided");
        }
    }

}