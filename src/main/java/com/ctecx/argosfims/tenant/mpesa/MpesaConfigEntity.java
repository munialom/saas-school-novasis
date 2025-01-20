package com.ctecx.argosfims.tenant.mpesa;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;




@Entity
@Table(name = "mpesa_configuration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MpesaConfigEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "consumer_key")
    private String consumerKey;

    @Column(name = "consumer_secret")
    private String consumerSecret;

    @Column(name = "grant_type")
    private String grantType;

    @Column(name = "oauth_endpoint")
    private String oauthEndpoint;

    @Column(name = "register_url_endpoint")
    private String registerUrlEndpoint;

    @Column(name = "simulate_transaction_endpoint")
    private String simulateTransactionEndpoint;

    @Column(name = "short_code")
    private String shortCode;

    @Column(name = "confirmation_url")
    private String confirmationURL;

    @Column(name = "validation_url")
    private String validationURL;

    @Column(name = "response_type")
    private String responseType;

    @Column(name = "b2c_transaction_endpoint")
    private String b2cTransactionEndpoint;

    @Column(name = "b2c_result_url")
    private String b2cResultUrl;

    @Column(name = "b2c_queue_timeout_url")
    private String b2cQueueTimeoutUrl;

    @Column(name = "b2c_initiator_name")
    private String b2cInitiatorName;

    @Column(name = "b2c_initiator_password")
    private String b2cInitiatorPassword;

    @Column(name = "transaction_result_url")
    private String transactionResultUrl;

    @Column(name = "check_account_balance_url")
    private String checkAccountBalanceUrl;

    @Column(name = "stk_pass_key")
    private String stkPassKey;

    @Column(name = "stk_push_short_code")
    private String stkPushShortCode;

    @Column(name = "stk_push_request_url")
    private String stkPushRequestUrl;

    @Column(name = "stk_push_request_callback_url")
    private String stkPushRequestCallbackUrl;

    @Column(name = "lnm_query_request_url")
    private String lnmQueryRequestUrl;

    @Column(name = "production")
    private boolean production;

}