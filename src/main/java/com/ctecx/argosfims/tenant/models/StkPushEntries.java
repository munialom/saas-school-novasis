package com.ctecx.argosfims.tenant.models;



import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "stk_push_entries")
@Data
public class StkPushEntries {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "internal_id")
    private String internalId;

    @Column(name = "transaction_id", unique = true)
    private String transactionId;

    @Column(name = "transaction_type")
    private String transactionType;

    @Column(name = "msisdn")
    private String msisdn;

    @Column(name = "amount")
    private Long amount;

    @Column(name = "merchant_request_id", unique = true)
    private String merchantRequestID;

    @Column(name = "checkout_request_id", unique = true)
    private String checkoutRequestID;

    @Column(name = "entry_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date entryDate;

    @Column(name = "result_code")
    private String resultCode;

    @Column(name = "raw_callback_payload_response", columnDefinition = "TEXT")
    private String rawCallbackPayloadResponse;
}