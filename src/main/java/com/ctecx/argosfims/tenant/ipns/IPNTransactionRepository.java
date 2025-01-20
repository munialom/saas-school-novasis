package com.ctecx.argosfims.tenant.ipns;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IPNTransactionRepository extends JpaRepository<IPNTransaction, Long> {
    boolean existsByTransactionReference(String transactionRef);
}