package com.ctecx.argosfims.tenant.services;


import com.ctecx.argosfims.tenant.dtos.*;
import com.ctecx.argosfims.tenant.models.CustomerPaymentsMpesa;
import com.ctecx.argosfims.tenant.models.CustomerPaymentsMpesaRepository;
import com.ctecx.argosfims.tenant.models.StkPushEntries;
import com.ctecx.argosfims.tenant.models.StkPushEntriesRepository;
import com.ctecx.argosfims.tenant.utils.DarajaException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@Slf4j
public class MpesaService {

    private final DarajaApi darajaApi;
    private final CustomerPaymentsMpesaRepository customerPaymentsMpesaRepository;
    private final StkPushEntriesRepository stkPushEntriesRepository;




    public MpesaService(DarajaApi darajaApi,
                        CustomerPaymentsMpesaRepository customerPaymentsMpesaRepository,
                        StkPushEntriesRepository stkPushEntriesRepository) {
        this.darajaApi = darajaApi;
        this.customerPaymentsMpesaRepository = customerPaymentsMpesaRepository;
        this.stkPushEntriesRepository = stkPushEntriesRepository;

    }

    public AccessTokenResponse getAccessToken() throws Exception {
        log.info("Retrieving access token");
        return darajaApi.getAccessToken();
    }

    public RegisterUrlResponse registerUrl() throws Exception {
        log.info("Registering URL");
        return darajaApi.registerUrl();
    }

   

    public void processMpesaValidation(MpesaValidationResponse mpesaValidationResponse) {
        log.info("Processing validation request: {}", mpesaValidationResponse);
        CustomerPaymentsMpesa customerPaymentsMpesa = new CustomerPaymentsMpesa();
        customerPaymentsMpesa.setRawCallbackPayloadResponse(mpesaValidationResponse.toString());
        customerPaymentsMpesa.setResultCode("0");
        customerPaymentsMpesa.setTransactionId(mpesaValidationResponse.getTransID());
        customerPaymentsMpesaRepository.save(customerPaymentsMpesa);
        log.info("Validation processed successfully for transaction ID: {}", mpesaValidationResponse.getTransID());
    }

    public SimulateTransactionResponse simulateC2BTransaction(SimulateTransactionRequest request) throws DarajaException {
        log.info("Processing C2B simulation request: {}", request);
        SimulateTransactionResponse response = darajaApi.simulateC2BTransaction(request);

        CustomerPaymentsMpesa b2C_c2BEntry = new CustomerPaymentsMpesa();
        b2C_c2BEntry.setTransactionType("C2B");
        b2C_c2BEntry.setBillRefNumber(request.getBillRefNumber());
        b2C_c2BEntry.setAmount(request.getAmount());
        b2C_c2BEntry.setEntryDate(new Date());
        b2C_c2BEntry.setOriginatorConversationId(response.getOriginatorConversationID());
        b2C_c2BEntry.setMsisdn(request.getMsisdn());
        customerPaymentsMpesaRepository.save(b2C_c2BEntry);

        log.info("C2B simulation processed successfully for bill ref: {}", request.getBillRefNumber());
        return response;
    }

    public void processB2CTransactionResult(B2CTransactionAsyncResponse response) {
        log.info("Processing B2C transaction result: {}", response);
        Result b2cResult = response.getResult();
        CustomerPaymentsMpesa b2cInternalRecord = customerPaymentsMpesaRepository.findByConversationIdOrOriginatorConversationId(
                b2cResult.getConversationID(),
                b2cResult.getOriginatorConversationID());

        if (b2cInternalRecord == null) {
            log.warn("No matching B2C record found for conversation ID: {} or originator conversation ID: {}",
                    b2cResult.getConversationID(), b2cResult.getOriginatorConversationID());
            return;
        }

        b2cInternalRecord.setRawCallbackPayloadResponse(response.toString());
        b2cInternalRecord.setResultCode(String.valueOf(b2cResult.getResultCode()));
        b2cInternalRecord.setTransactionId(b2cResult.getTransactionID());

        customerPaymentsMpesaRepository.save(b2cInternalRecord);
        log.info("B2C transaction result processed successfully for transaction ID: {}", b2cResult.getTransactionID());
    }

    public CommonSyncResponse performB2CTransaction(InternalB2CTransactionRequest request) throws Exception {
        log.info("Processing B2C transaction request: {}", request);
        CommonSyncResponse response = darajaApi.performB2CTransaction(request);

        CustomerPaymentsMpesa b2C_c2BEntry = new CustomerPaymentsMpesa();
        b2C_c2BEntry.setTransactionType("B2C");
        b2C_c2BEntry.setAmount(request.getAmount());
        b2C_c2BEntry.setEntryDate(new Date());
        b2C_c2BEntry.setOriginatorConversationId(response.getOriginatorConversationID());
        b2C_c2BEntry.setConversationId(response.getConversationID());
        b2C_c2BEntry.setMsisdn(request.getPartyB());

        customerPaymentsMpesaRepository.save(b2C_c2BEntry);
        log.info("B2C transaction processed successfully for conversation ID: {}", response.getConversationID());

        return response;
    }

    public TransactionStatusSyncResponse getTransactionResult(InternalTransactionStatusRequest request) throws Exception {
        log.info("Retrieving transaction status for: {}", request);
        return darajaApi.getTransactionResult(request);
    }

    public CommonSyncResponse checkAccountBalance() throws Exception {
        log.info("Checking account balance");
        return darajaApi.checkAccountBalance();
    }

    public StkPushSyncResponse performStkPushTransaction(InternalStkPushRequest request) throws Exception {
        log.info("Processing STK push transaction request: {}", request);
        return darajaApi.performStkPushTransaction(request);
    }

    public void processStkPushAsyncResponse(StkPushAsyncResponse response) {
        log.info("Processing STK Push Async Response: {}", response);
        StkPushEntries stkPushEntry = new StkPushEntries();
        stkPushEntry.setMerchantRequestID(response.getBody().getStkCallback().getMerchantRequestID());
        stkPushEntry.setCheckoutRequestID(response.getBody().getStkCallback().getCheckoutRequestID());
        stkPushEntry.setResultCode(String.valueOf(response.getBody().getStkCallback().getResultCode()));
        stkPushEntry.setRawCallbackPayloadResponse(response.toString());
        stkPushEntry.setEntryDate(new Date());

        StkPushEntries savedEntry = stkPushEntriesRepository.save(stkPushEntry);
        log.info("Saved STK Push entry with ID: {}", savedEntry.getId());
    }

    public LNMQueryResponse getTransactionStatus(InternalLNMRequest request) throws Exception {
        log.info("Processing LNM query request: {}", request);
        return darajaApi.getTransactionStatus(request);
    }
}