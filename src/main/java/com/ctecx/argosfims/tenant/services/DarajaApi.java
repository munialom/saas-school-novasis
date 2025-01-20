package com.ctecx.argosfims.tenant.services;


import com.ctecx.argosfims.tenant.dtos.*;

public interface DarajaApi {

    /**
     * @return Returns Daraja API Access Token Response
     */
    AccessTokenResponse getAccessToken();

    RegisterUrlResponse registerUrl();



    SimulateTransactionResponse simulateC2BTransaction(SimulateTransactionRequest simulateTransactionRequest);

    CommonSyncResponse performB2CTransaction(InternalB2CTransactionRequest internalB2CTransactionRequest);

    TransactionStatusSyncResponse getTransactionResult(InternalTransactionStatusRequest internalTransactionStatusRequest);

    CommonSyncResponse checkAccountBalance();

    StkPushSyncResponse performStkPushTransaction(InternalStkPushRequest internalStkPushRequest);

    LNMQueryResponse getTransactionStatus(InternalLNMRequest internalLNMRequest);
}
