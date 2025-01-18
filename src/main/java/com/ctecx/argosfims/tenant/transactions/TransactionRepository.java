package com.ctecx.argosfims.tenant.transactions;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    boolean existsByStudent_IdAndAccountChart_IdAndTerm(Long studentId, int accountId, String term);
}