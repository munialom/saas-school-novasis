package com.ctecx.argosfims.tenant.models;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerPaymentsMpesaRepository extends JpaRepository<CustomerPaymentsMpesa, Long> {
    CustomerPaymentsMpesa findByConversationIdOrOriginatorConversationId(String conversationId, String originatorConversationId);

    // Find Transaction By TransactionId ....
    CustomerPaymentsMpesa findByTransactionId(String transactionId);

    CustomerPaymentsMpesa findByBillRefNumber(String billRefNumber);
}