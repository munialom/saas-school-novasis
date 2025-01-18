package com.ctecx.argosfims.tenant.utils;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountGroup;
import com.ctecx.argosfims.tenant.transactions.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class TransactionHelper {
    private static final Logger log = LoggerFactory.getLogger(TransactionHelper.class);

    // Inner class for transaction entries
    public static class TransactionEntry {
        private final AccountChart account;
        private final boolean isDebit;
        private final BigDecimal amount;

        public TransactionEntry(AccountChart account, boolean isDebit, BigDecimal amount) {
            this.account = account;
            this.isDebit = isDebit;
            this.amount = amount;
        }

        public AccountChart getAccount() {
            return account;
        }

        public boolean isDebit() {
            return isDebit;
        }

        public BigDecimal getAmount() {
            return amount;
        }
    }


    // Public transaction creation methods


    // Main method with party parameter
    public static List<Transaction> createBalancedTransaction(LocalDate transactionDate,
                                                              String description,
                                                              String paymentMode,
                                                              String module,
                                                              List<TransactionEntry> entries,
                                                              Object party) {
        try {
            validateInputs(transactionDate, description, paymentMode, module, entries);

            List<Transaction> transactions = new ArrayList<>();
            BigDecimal totalDebits = BigDecimal.ZERO;
            BigDecimal totalCredits = BigDecimal.ZERO;
            String voucherNumber = generateVoucherNumber(); // Generate generic voucher number


            for (TransactionEntry entry : entries) {
                if (entry.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                    continue;
                }

                Transaction transaction = createTransaction(transactionDate, description, paymentMode, module, entry, voucherNumber);


                if (party != null && !isModuleWithoutParty(module)) {
                    // Check if the party is a String before setting it.
                    if (party instanceof String) {
                        transaction.setParty((String) party);
                    } else {
                        throw new TransactionException("Invalid Party type. Expected String.", "INVALID_PARTY_TYPE");
                    }

                }

                transactions.add(transaction);

                if (entry.isDebit()) {
                    totalDebits = totalDebits.add(entry.getAmount());
                } else {
                    totalCredits = totalCredits.add(entry.getAmount());
                }
            }

            validateBalancedTransaction(totalDebits, totalCredits);
            return transactions;
        } catch (TransactionException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error occurred while creating balanced transaction: {}",e.getMessage(),e);
            throw new TransactionException("Unexpected error occurred while creating balanced transaction: " + e.getMessage(), "UNEXPECTED_ERROR");
        }
    }

    // Private helper methods

    private static Transaction createTransaction(LocalDate transactionDate,
                                                 String description,
                                                 String paymentMode,
                                                 String module,
                                                 TransactionEntry entry,
                                                 String serialNumber) {
        try {
            Transaction transaction = new Transaction();
            transaction.setTransactionDate(transactionDate);
            transaction.setDescription(description);
            transaction.setMode(paymentMode);
            transaction.setModule(module);
            transaction.setAccountChart(entry.account);
            transaction.setAccountName(entry.account.getName());
            transaction.setSerialNumber(serialNumber);
            applyTransaction(transaction, entry.isDebit, entry.amount);
            return transaction;
        } catch (TransactionException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error creating transaction: {}",e.getMessage(),e);
            throw new TransactionException("Error creating transaction: " + e.getMessage(), "CREATE_TRANSACTION_ERROR");
        }
    }

    private static void applyTransaction(Transaction transaction, boolean isDebit, BigDecimal amount) {
        try {
            validateAmount(amount);

            transaction.setDebit(isDebit ? amount : BigDecimal.ZERO);
            transaction.setCredit(isDebit ? BigDecimal.ZERO : amount);
            transaction.setAmount(amount);

            String status = determineTransactionStatus(transaction.getAccountChart().getAccountGroupEnum(), isDebit);
            transaction.setStatus(status);
            transaction.setTransactionType(isDebit ? "Debit" : "Credit");
        } catch (TransactionException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error applying transaction: {}",e.getMessage(),e);
            throw new TransactionException("Error applying transaction: " + e.getMessage(), "APPLY_TRANSACTION_ERROR");
        }
    }

    private static String determineTransactionStatus(AccountGroup accountGroup, boolean isDebit) {
        try {
            switch (accountGroup) {
                case CURRENT_ASSETS:
                case FIXED_ASSETS:
                case LONG_TERM_INVESTMENTS:
                case OTHER_ASSETS:
                    return isDebit ? "Debit" : "Credit";
                case CURRENT_LIABILITIES:
                case LONG_TERM_LIABILITIES:
                case SHARE_CAPITAL:
                case RETAINED_EARNINGS:
                    return isDebit ? "Credit" : "Debit";
                case OPERATING_REVENUE:
                case NON_OPERATING_REVENUE:
                    return isDebit ? "Credit" : "Debit";
                case OPERATING_EXPENSES:
                case NON_OPERATING_EXPENSES:
                case COST_OF_GOODS_SOLD:
                    return isDebit ? "Debit" : "Credit";
                default:
                    throw new TransactionException.InvalidAccountGroupException("Unknown account group: " + accountGroup);
            }
        } catch (TransactionException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error determining transaction status: {}",e.getMessage(),e);
            throw new TransactionException("Error determining transaction status: " + e.getMessage(), "DETERMINE_STATUS_ERROR");
        }
    }


    // Validation methods

    private static void validateInputs(LocalDate transactionDate,
                                       String description,
                                       String paymentMode,
                                       String module,
                                       List<TransactionEntry> entries) {
        // Validate transaction date
        if (transactionDate == null) {
            throw new TransactionException.InvalidInputException(
                    "Transaction date cannot be null",
                    "DATE"
            );
        }

        // Validate description
        if (description == null || description.trim().isEmpty()) {
            throw new TransactionException.InvalidInputException(
                    "Description cannot be empty or null",
                    "DESCRIPTION"
            );
        }

        // Validate payment mode
        if (paymentMode == null || paymentMode.trim().isEmpty()) {
            throw new TransactionException.InvalidInputException(
                    "Payment mode cannot be empty or null",
                    "PAYMENT_MODE"
            );
        }

        // Validate module
        if (module == null || module.trim().isEmpty()) {
            throw new TransactionException.InvalidInputException(
                    "Module cannot be empty or null",
                    "MODULE"
            );
        }

        // Validate entries
        if (entries == null) {
            throw new TransactionException.InvalidInputException(
                    "Transaction entries cannot be null",
                    "ENTRIES"
            );
        }

        if (entries.isEmpty()) {
            throw new TransactionException.InvalidInputException(
                    "Transaction entries cannot be empty",
                    "ENTRIES"
            );
        }

        // Validate individual entries
        for (TransactionEntry entry : entries) {
            if (entry == null) {
                throw new TransactionException.InvalidInputException(
                        "Transaction entry cannot be null",
                        "ENTRY"
                );
            }

            if (entry.getAccount() == null) {
                throw new TransactionException.InvalidInputException(
                        "Account cannot be null in transaction entry",
                        "ACCOUNT"
                );
            }

            if (entry.getAmount() == null) {
                throw new TransactionException.InvalidInputException(
                        "Amount cannot be null in transaction entry",
                        "AMOUNT"
                );
            }
        }
    }

    private static void validateAmount(BigDecimal amount) {
        if (amount == null) {
            throw new TransactionException.InvalidAmountException("Amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new TransactionException.InvalidAmountException("Amount must be non-negative");
        }
    }

    private static void validateBalancedTransaction(BigDecimal totalDebits, BigDecimal totalCredits) {
        if (totalDebits.subtract(totalCredits).abs().compareTo(new BigDecimal("0.001")) > 0) {
            throw new TransactionException.UnbalancedTransactionException(
                    "Transaction is not balanced. Total Debits: " + totalDebits + ", Total Credits: " + totalCredits
            );
        }
    }


    // Utility methods

    private static String generateVoucherNumber() {
        return "VCH-" + System.currentTimeMillis(); // Simplified voucher number generation
    }

    private static boolean isModuleWithoutParty(String module) {
        return module != null &&
                (module.equals("Journal") ||
                        module.equals("Internal Transfer"));
    }

    // Method to check if transaction can have a party
    public static boolean canHaveParty(String module) {
        return !isModuleWithoutParty(module);
    }
}