package com.ctecx.argosfims.tenant.models;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.Data;

import java.io.IOException;
import java.util.Date;

@Entity
@Table(name = "Customer_Transactions")
@Data
public class CustomerPaymentsMpesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "internal_id")
    private String internalId;

    @Column(name = "transaction_type")
    private String transactionType;

    @Column(name = "transaction_id", unique = true)
    private String transactionId;

    @Column(name = "bill_ref_number")
    private String billRefNumber;

    @Column(name = "msisdn")
    private String msisdn;

    @Column(name = "amount")
    private String amount;

    @Column(name = "conversation_id", unique = true)
    private String conversationId;

    @Column(name = "originator_conversation_id", unique = true)
    private String originatorConversationId;

    @Column(name = "entry_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date entryDate;

    @Column(name = "result_code")
    private String resultCode;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "raw_callback_payload_response", columnDefinition = "TEXT")
    private String rawCallbackPayloadResponse;

    @Enumerated(EnumType.STRING)
    private MpesaTransactionState transactionState;

    public void extractAndSetFirstName() {
        if (rawCallbackPayloadResponse != null && !rawCallbackPayloadResponse.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(rawCallbackPayloadResponse);

                JsonNode firstNameNode = jsonNode.path("firstName");
                if (!firstNameNode.isMissingNode()) {
                    this.firstName = firstNameNode.asText();
                }
            } catch (IOException e) {
                // Log the error or handle it as appropriate for your application
                e.printStackTrace();
            }
        }
    }
}