package com.ctecx.argosfims.tenant.accounting;



import com.ctecx.argosfims.tenant.transactions.Transaction;
import com.ctecx.argosfims.tenant.transactions.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NonProfitAccountingSystem implements AccountingSystem {
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    public void recordTransactions(List<Transaction> newTransactions) {
        try {
            List<Transaction> savedTransactions = transactionRepository.saveAll(newTransactions);
            System.out.println("Recorded " + savedTransactions.size() + " new transactions in the database.");
            System.out.println("Total transactions in database: " + transactionRepository.count());
        } catch (Exception e) {
            System.err.println("Error saving transactions to the database: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to record transactions",e);
        }
    }

    @Override
    public List<Transaction> getTransactions() {
        return transactionRepository.findAll();
    }
}