package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.transactions.Transaction;
import java.util.List;

public interface AccountingSystem {
    void recordTransactions(List<Transaction> transactions);
    List<Transaction> getTransactions();
}