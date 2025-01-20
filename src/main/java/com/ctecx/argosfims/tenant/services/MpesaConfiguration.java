/*
package com.ctecx.argosfims.tenant.services;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "mpesa.daraja")
public class MpesaConfiguration {
    private String consumerKey;
    private String consumerSecret;
    private String grantType;
    private String oauthEndpoint;
    private String registerUrlEndpoint;
    private String simulateTransactionEndpoint;
    private String shortCode;
    private String confirmationURL;
    private String validationURL;
    private String responseType;
    private String b2cTransactionEndpoint;
    private String b2cResultUrl;
    private String b2cQueueTimeoutUrl;
    private String b2cInitiatorName;
    private String b2cInitiatorPassword;
    private String transactionResultUrl;
    private String checkAccountBalanceUrl;
    private String stkPassKey;
    private String stkPushShortCode;
    private String stkPushRequestUrl;
    private String stkPushRequestCallbackUrl;
    private String lnmQueryRequestUrl;

    private boolean production;

    public String getConsumerKey() {
        return consumerKey;
    }

    public MpesaConfiguration setConsumerKey(String consumerKey) {
        this.consumerKey = consumerKey;
        return this;
    }

    public String getConsumerSecret() {
        return consumerSecret;
    }

    public MpesaConfiguration setConsumerSecret(String consumerSecret) {
        this.consumerSecret = consumerSecret;
        return this;
    }

    public String getGrantType() {
        return grantType;
    }

    public MpesaConfiguration setGrantType(String grantType) {
        this.grantType = grantType;
        return this;
    }

    public String getOauthEndpoint() {
        return oauthEndpoint;
    }

    public MpesaConfiguration setOauthEndpoint(String oauthEndpoint) {
        this.oauthEndpoint = oauthEndpoint;
        return this;
    }

    public String getRegisterUrlEndpoint() {
        return registerUrlEndpoint;
    }

    public MpesaConfiguration setRegisterUrlEndpoint(String registerUrlEndpoint) {
        this.registerUrlEndpoint = registerUrlEndpoint;
        return this;
    }

    public String getSimulateTransactionEndpoint() {
        return simulateTransactionEndpoint;
    }

    public MpesaConfiguration setSimulateTransactionEndpoint(String simulateTransactionEndpoint) {
        this.simulateTransactionEndpoint = simulateTransactionEndpoint;
        return this;
    }

    public String getShortCode() {
        return shortCode;
    }

    public MpesaConfiguration setShortCode(String shortCode) {
        this.shortCode = shortCode;
        return this;
    }

    public String getConfirmationURL() {
        return confirmationURL;
    }

    public MpesaConfiguration setConfirmationURL(String confirmationURL) {
        this.confirmationURL = confirmationURL;
        return this;
    }

    public String getValidationURL() {
        return validationURL;
    }

    public MpesaConfiguration setValidationURL(String validationURL) {
        this.validationURL = validationURL;
        return this;
    }

    public String getResponseType() {
        return responseType;
    }

    public MpesaConfiguration setResponseType(String responseType) {
        this.responseType = responseType;
        return this;
    }

    public String getB2cTransactionEndpoint() {
        return b2cTransactionEndpoint;
    }

    public MpesaConfiguration setB2cTransactionEndpoint(String b2cTransactionEndpoint) {
        this.b2cTransactionEndpoint = b2cTransactionEndpoint;
        return this;
    }

    public String getB2cResultUrl() {
        return b2cResultUrl;
    }

    public MpesaConfiguration setB2cResultUrl(String b2cResultUrl) {
        this.b2cResultUrl = b2cResultUrl;
        return this;
    }

    public String getB2cQueueTimeoutUrl() {
        return b2cQueueTimeoutUrl;
    }

    public MpesaConfiguration setB2cQueueTimeoutUrl(String b2cQueueTimeoutUrl) {
        this.b2cQueueTimeoutUrl = b2cQueueTimeoutUrl;
        return this;
    }

    public String getB2cInitiatorName() {
        return b2cInitiatorName;
    }

    public MpesaConfiguration setB2cInitiatorName(String b2cInitiatorName) {
        this.b2cInitiatorName = b2cInitiatorName;
        return this;
    }

    public String getB2cInitiatorPassword() {
        return b2cInitiatorPassword;
    }

    public boolean isProduction() {
        return production;
    }

    public MpesaConfiguration setProduction(boolean production) {
        this.production = production;
        return this;
    }

    public MpesaConfiguration setB2cInitiatorPassword(String b2cInitiatorPassword) {
        this.b2cInitiatorPassword = b2cInitiatorPassword;
        return this;
    }

    public String getTransactionResultUrl() {
        return transactionResultUrl;
    }

    public MpesaConfiguration setTransactionResultUrl(String transactionResultUrl) {
        this.transactionResultUrl = transactionResultUrl;
        return this;
    }

    public String getCheckAccountBalanceUrl() {
        return checkAccountBalanceUrl;
    }

    public MpesaConfiguration setCheckAccountBalanceUrl(String checkAccountBalanceUrl) {
        this.checkAccountBalanceUrl = checkAccountBalanceUrl;
        return this;
    }

    public String getStkPassKey() {
        return stkPassKey;
    }

    public MpesaConfiguration setStkPassKey(String stkPassKey) {
        this.stkPassKey = stkPassKey;
        return this;
    }

    public String getStkPushShortCode() {
        return stkPushShortCode;
    }

    public MpesaConfiguration setStkPushShortCode(String stkPushShortCode) {
        this.stkPushShortCode = stkPushShortCode;
        return this;
    }

    public String getStkPushRequestUrl() {
        return stkPushRequestUrl;
    }

    public MpesaConfiguration setStkPushRequestUrl(String stkPushRequestUrl) {
        this.stkPushRequestUrl = stkPushRequestUrl;
        return this;
    }

    public String getStkPushRequestCallbackUrl() {
        return stkPushRequestCallbackUrl;
    }

    public MpesaConfiguration setStkPushRequestCallbackUrl(String stkPushRequestCallbackUrl) {
        this.stkPushRequestCallbackUrl = stkPushRequestCallbackUrl;
        return this;
    }

    public String getLnmQueryRequestUrl() {
        return lnmQueryRequestUrl;
    }

    public MpesaConfiguration setLnmQueryRequestUrl(String lnmQueryRequestUrl) {
        this.lnmQueryRequestUrl = lnmQueryRequestUrl;
        return this;
    }

    @Override
    public String toString() {
        return String.format("MpesaConfiguration{consumerKey='%s', consumerSecret='%s', grantType='%s', oauthEndpoint='%s', ...}",
                consumerKey, consumerSecret, grantType, oauthEndpoint);
    }
}*/


package com.ctecx.argosfims.tenant.services;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class MpesaConfiguration {
    private String consumerKey;
    private String consumerSecret;
    private String grantType;
    private String oauthEndpoint;
    private String registerUrlEndpoint;
    private String simulateTransactionEndpoint;
    private String shortCode;
    private String confirmationURL;
    private String validationURL;
    private String responseType;
    private String b2cTransactionEndpoint;
    private String b2cResultUrl;
    private String b2cQueueTimeoutUrl;
    private String b2cInitiatorName;
    private String b2cInitiatorPassword;
    private String transactionResultUrl;
    private String checkAccountBalanceUrl;
    private String stkPassKey;
    private String stkPushShortCode;
    private String stkPushRequestUrl;
    private String stkPushRequestCallbackUrl;
    private String lnmQueryRequestUrl;
    private boolean production;
    @Override
    public String toString() {
        return String.format("MpesaConfiguration{consumerKey='%s', consumerSecret='%s', grantType='%s', oauthEndpoint='%s', ...}",
                consumerKey, consumerSecret, grantType, oauthEndpoint);
    }
}




