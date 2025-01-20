package com.ctecx.argosfims.tenant.services;

import com.ctecx.argosfims.tenant.dtos.*;
import com.ctecx.argosfims.tenant.helpers.Constants;
import com.ctecx.argosfims.tenant.helpers.HelperUtility;
import com.ctecx.argosfims.tenant.mpesa.TenantMpesaConfigurationProvider;
import com.ctecx.argosfims.tenant.utils.DarajaException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static com.ctecx.argosfims.tenant.helpers.Constants.*;


@Service
@Slf4j
public class DarajaApiImpl implements DarajaApi {

    private final TenantMpesaConfigurationProvider mpesaConfigurationProvider;
    private final OkHttpClient okHttpClient;
    private final ObjectMapper objectMapper;
    private final Jackson2ObjectMapperBuilder objectMapperBuilder;

    public DarajaApiImpl(TenantMpesaConfigurationProvider mpesaConfigurationProvider, OkHttpClient okHttpClient, ObjectMapper objectMapper, Jackson2ObjectMapperBuilder objectMapperBuilder) {
        this.mpesaConfigurationProvider = mpesaConfigurationProvider;
        this.okHttpClient = okHttpClient;
        this.objectMapper = objectMapper;

        this.objectMapperBuilder = objectMapperBuilder;
    }


    @Override
    public AccessTokenResponse getAccessToken() {
        MpesaConfiguration mpesaConfiguration =  mpesaConfigurationProvider.getMpesaConfiguration();

        String encodedCredentials = HelperUtility.toBase64String(
                String.format("%s:%s", mpesaConfiguration.getConsumerKey(), mpesaConfiguration.getConsumerSecret()));

        Request request = new Request.Builder()
                .url(String.format("%s?grant_type=%s", mpesaConfiguration.getOauthEndpoint(), mpesaConfiguration.getGrantType()))
                .get()
                .header(AUTHORIZATION_HEADER_STRING, String.format("%s %s", BASIC_AUTH_STRING, encodedCredentials))
                .build();

        return executeRequest(request, AccessTokenResponse.class)
                .orElse(null);
    }


    public RegisterUrlResponse registerUrl() {
        log.info("Starting registerUrl process");
        MpesaConfiguration mpesaConfiguration =  mpesaConfigurationProvider.getMpesaConfiguration();
        AccessTokenResponse accessTokenResponse = getAccessToken();
        if (isInvalidAccessToken(accessTokenResponse)) {
            return null;
        }

        RegisterUrlRequest registerUrlRequest = createRegisterUrlRequest(mpesaConfiguration);
        String requestJson = serializeRequest(registerUrlRequest);
        if (requestJson == null) {
            return null;
        }

        Request request = buildHttpRequest(requestJson, accessTokenResponse.getAccessToken(),mpesaConfiguration);
        return executeRequest(request);
    }

    private boolean isInvalidAccessToken(AccessTokenResponse accessTokenResponse) {
        if (accessTokenResponse == null || accessTokenResponse.getAccessToken() == null) {
            log.error("Failed to obtain access token. AccessTokenResponse: {}", accessTokenResponse);
            return true;
        }
        log.info("Successfully obtained access token: {}", accessTokenResponse.getAccessToken());
        return false;
    }

    private RegisterUrlRequest createRegisterUrlRequest(MpesaConfiguration mpesaConfiguration) {
        RegisterUrlRequest registerUrlRequest = new RegisterUrlRequest();
        registerUrlRequest.setShortCode(mpesaConfiguration.getShortCode());
        registerUrlRequest.setResponseType(mpesaConfiguration.getResponseType());
        registerUrlRequest.setConfirmationURL(mpesaConfiguration.getConfirmationURL());
        registerUrlRequest.setValidationURL(mpesaConfiguration.getValidationURL());
        log.info("Prepared RegisterUrl Request: {}", registerUrlRequest);
        return registerUrlRequest;
    }

    private String serializeRequest(Object request) {
        try {
            String requestJson = objectMapper.writeValueAsString(request);
            log.info("Serialized request JSON: {}", requestJson);
            return requestJson;
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize request to JSON", e);
            return null;
        }
    }

    private Request buildHttpRequest(String requestJson, String accessToken, MpesaConfiguration mpesaConfiguration) {
        RequestBody body = RequestBody.create(requestJson, MediaType.get("application/json"));
        String authorizationHeader = formatBearerToken(accessToken);
        log.info("Prepared Authorization Header: {}", authorizationHeader);

        Request request = new Request.Builder()
                .url(mpesaConfiguration.getRegisterUrlEndpoint())
                .post(body)
                .header("Content-Type", "application/json")
                .header("Authorization", authorizationHeader)
                .build();

        log.info("Prepared request. URL: {}, Method: {}, Headers: {}", request.url(), request.method(), request.headers());
        return request;
    }

    private RegisterUrlResponse executeRequest(Request request) {
        try (Response response = okHttpClient.newCall(request).execute()) {
            String responseBody = response.body().string();
            log.info("Received response. Code: {}, Body: {}", response.code(), responseBody);

            if (response.isSuccessful()) {
                return deserializeResponse(responseBody);
            } else {
                log.error("API call failed. Status: {}, Body: {}", response.code(), responseBody);
            }
        } catch (IOException e) {
            log.error("Request execution failed", e);
        }

        log.warn("RegisterUrl process completed with null result");
        return null;
    }

    private RegisterUrlResponse deserializeResponse(String responseBody) {
        try {
            RegisterUrlResponse result = objectMapper.readValue(responseBody, RegisterUrlResponse.class);
            log.info("Successfully deserialized response: {}", result);
            return result;
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize response", e);
            return null;
        }
    }

    private String formatBearerToken(String token) {
        return "Bearer " + token;
    }

    @Override
    public SimulateTransactionResponse simulateC2BTransaction(SimulateTransactionRequest simulateTransactionRequest) throws DarajaException {
        log.info("Starting C2B transaction simulation for ShortCode: {}", simulateTransactionRequest.getShortCode());
        MpesaConfiguration mpesaConfiguration =  mpesaConfigurationProvider.getMpesaConfiguration();
        return CompletableFuture.supplyAsync(this::getAccessToken)
                .thenApply(accessTokenResponse -> {
                    if (accessTokenResponse == null || accessTokenResponse.getAccessToken() == null) {
                        throw new DarajaException("Failed to obtain access token for C2B simulation");
                    }
                    log.info("Successfully obtained access token for C2B simulation");

                    String requestJson = HelperUtility.toJson(simulateTransactionRequest);
                    log.info("C2B Simulation Request JSON: {}", requestJson);

                    RequestBody body = RequestBody.create(requestJson, MediaType.parse("application/json"));
                    String simulateEndpoint = mpesaConfiguration.getSimulateTransactionEndpoint();
                    log.info("Sending C2B simulation request to endpoint: {}", simulateEndpoint);

                    Request request = new Request.Builder()
                            .url(simulateEndpoint)
                            .post(body)
                            .header("Content-Type", "application/json")
                            .header("Authorization", "Bearer " + accessTokenResponse.getAccessToken())
                            .header("Cache-Control", "no-cache")
                            .build();

                    return executeRequest(request, SimulateTransactionResponse.class)
                            .orElseThrow(() -> new DarajaException("Failed to get C2B simulation response"));
                })
                .exceptionally(ex -> {
                    if (ex instanceof DarajaException) {
                        throw (DarajaException) ex;
                    }
                    throw new DarajaException("Exception occurred during C2B transaction simulation", ex);
                })
                .join();
    }


    @Override
    public CommonSyncResponse performB2CTransaction(InternalB2CTransactionRequest internalB2CTransactionRequest) {
        MpesaConfiguration mpesaConfiguration =  mpesaConfigurationProvider.getMpesaConfiguration();
        return CompletableFuture.supplyAsync(this::getAccessToken)
                .thenApply(accessTokenResponse -> {
                    log.info("Access Token: {}", accessTokenResponse.getAccessToken());

                    B2CTransactionRequest b2CTransactionRequest = new B2CTransactionRequest();
                    b2CTransactionRequest.setCommandID(internalB2CTransactionRequest.getCommandID());
                    b2CTransactionRequest.setAmount(internalB2CTransactionRequest.getAmount());
                    b2CTransactionRequest.setPartyB(internalB2CTransactionRequest.getPartyB());
                    b2CTransactionRequest.setRemarks(internalB2CTransactionRequest.getRemarks());
                    b2CTransactionRequest.setOccassion(internalB2CTransactionRequest.getOccassion());
                    b2CTransactionRequest.setSecurityCredential(HelperUtility.getSecurityCredentials(mpesaConfiguration.getB2cInitiatorPassword()));
                    b2CTransactionRequest.setResultURL(mpesaConfiguration.getB2cResultUrl());
                    b2CTransactionRequest.setQueueTimeOutURL(mpesaConfiguration.getB2cQueueTimeoutUrl());
                    b2CTransactionRequest.setInitiatorName(mpesaConfiguration.getB2cInitiatorName());
                    b2CTransactionRequest.setPartyA(mpesaConfiguration.getShortCode());

                    log.info("Security Creds: {}", b2CTransactionRequest.getSecurityCredential());

                    RequestBody body = RequestBody.create(Objects.requireNonNull(HelperUtility.toJson(b2CTransactionRequest)), JSON_MEDIA_TYPE);

                    Request request = new Request.Builder()
                            .url(mpesaConfiguration.getB2cTransactionEndpoint())
                            .post(body)
                            .header(AUTHORIZATION_HEADER_STRING, String.format("%s %s", BEARER_AUTH_STRING, accessTokenResponse.getAccessToken()))
                            .build();

                    return executeRequest(request, CommonSyncResponse.class)
                            .orElse(null);
                }).join();
    }


    @Override
    public TransactionStatusSyncResponse getTransactionResult(InternalTransactionStatusRequest internalTransactionStatusRequest) {
        MpesaConfiguration mpesaConfiguration =  mpesaConfigurationProvider.getMpesaConfiguration();

        return CompletableFuture.supplyAsync(this::getAccessToken)
                .thenApply(accessTokenResponse -> {
                    TransactionStatusRequest transactionStatusRequest = new TransactionStatusRequest();
                    transactionStatusRequest.setTransactionID(internalTransactionStatusRequest.getTransactionID());
                    transactionStatusRequest.setInitiator(mpesaConfiguration.getB2cInitiatorName());
                    transactionStatusRequest.setSecurityCredential(HelperUtility.getSecurityCredentials(mpesaConfiguration.getB2cInitiatorPassword()));
                    transactionStatusRequest.setCommandID(TRANSACTION_STATUS_QUERY_COMMAND);
                    transactionStatusRequest.setPartyA(mpesaConfiguration.getShortCode());
                    transactionStatusRequest.setIdentifierType(SHORT_CODE_IDENTIFIER);
                    transactionStatusRequest.setResultURL(mpesaConfiguration.getB2cResultUrl());
                    transactionStatusRequest.setQueueTimeOutURL(mpesaConfiguration.getB2cQueueTimeoutUrl());
                    transactionStatusRequest.setRemarks(TRANSACTION_STATUS_VALUE);
                    transactionStatusRequest.setOccasion(TRANSACTION_STATUS_VALUE);

                    RequestBody body = RequestBody.create(Objects.requireNonNull(HelperUtility.toJson(transactionStatusRequest)), JSON_MEDIA_TYPE);

                    Request request = new Request.Builder()
                            .url(mpesaConfiguration.getTransactionResultUrl())
                            .post(body)
                            .header(AUTHORIZATION_HEADER_STRING, String.format("%s %s", BEARER_AUTH_STRING, accessTokenResponse.getAccessToken()))
                            .build();

                    return executeRequest(request, TransactionStatusSyncResponse.class)
                            .orElse(null);
                }).join();
    }

    @Override
    public CommonSyncResponse checkAccountBalance() {
        MpesaConfiguration mpesaConfiguration =  mpesaConfigurationProvider.getMpesaConfiguration();
        return CompletableFuture.supplyAsync(this::getAccessToken)
                .thenApply(accessTokenResponse -> {
                    CheckAccountBalanceRequest checkAccountBalanceRequest = new CheckAccountBalanceRequest();
                    checkAccountBalanceRequest.setInitiator(mpesaConfiguration.getB2cInitiatorName());
                    checkAccountBalanceRequest.setSecurityCredential(HelperUtility.getSecurityCredentials(mpesaConfiguration.getB2cInitiatorPassword()));
                    checkAccountBalanceRequest.setCommandID(Constants.ACCOUNT_BALANCE_COMMAND);
                    checkAccountBalanceRequest.setPartyA(mpesaConfiguration.getShortCode());
                    checkAccountBalanceRequest.setIdentifierType(Constants.SHORT_CODE_IDENTIFIER);
                    checkAccountBalanceRequest.setRemarks("Check Account Balance");
                    checkAccountBalanceRequest.setQueueTimeOutURL(mpesaConfiguration.getB2cQueueTimeoutUrl());
                    checkAccountBalanceRequest.setResultURL(mpesaConfiguration.getB2cResultUrl());

                    RequestBody body = RequestBody.create(Objects.requireNonNull(HelperUtility.toJson(checkAccountBalanceRequest)), JSON_MEDIA_TYPE);

                    Request request = new Request.Builder()
                            .url(mpesaConfiguration.getCheckAccountBalanceUrl())
                            .post(body)
                            .header(AUTHORIZATION_HEADER_STRING, String.format("%s %s", BEARER_AUTH_STRING, accessTokenResponse.getAccessToken()))
                            .build();

                    return executeRequest(request, CommonSyncResponse.class)
                            .orElse(null);
                }).join();
    }
    @Override
    public StkPushSyncResponse performStkPushTransaction(InternalStkPushRequest internalStkPushRequest) {
        log.info("Starting STK Push transaction for phone number: {}", internalStkPushRequest.getPhoneNumber());
        MpesaConfiguration mpesaConfiguration =  mpesaConfigurationProvider.getMpesaConfiguration();
        return CompletableFuture.supplyAsync(this::getAccessToken)
                .thenApply(accessTokenResponse -> {
                    log.info("Access token obtained successfully");

                    ExternalStkPushRequest externalStkPushRequest = new ExternalStkPushRequest();
                    externalStkPushRequest.setBusinessShortCode(mpesaConfiguration.getStkPushShortCode());

                    String transactionTimestamp = HelperUtility.getTransactionTimestamp();
                    log.debug("Transaction timestamp: {}", transactionTimestamp);

                    String stkPushPassword = HelperUtility.getStkPushPassword(
                            mpesaConfiguration.getStkPushShortCode(),
                            mpesaConfiguration.getStkPassKey(),
                            transactionTimestamp
                    );
                    log.debug("STK Push password generated");

                    externalStkPushRequest.setPassword(stkPushPassword);
                    externalStkPushRequest.setTimestamp(transactionTimestamp);
                    externalStkPushRequest.setTransactionType(Constants.CUSTOMER_PAYBILL_ONLINE);
                    externalStkPushRequest.setAmount(internalStkPushRequest.getAmount());
                    externalStkPushRequest.setPartyA(internalStkPushRequest.getPhoneNumber());
                    externalStkPushRequest.setPartyB(mpesaConfiguration.getStkPushShortCode());
                    externalStkPushRequest.setPhoneNumber(internalStkPushRequest.getPhoneNumber());
                    externalStkPushRequest.setCallBackURL(mpesaConfiguration.getStkPushRequestCallbackUrl());
                    externalStkPushRequest.setAccountReference(HelperUtility.getTransactionUniqueNumber());
                    externalStkPushRequest.setTransactionDesc(String.format("%s Transaction", internalStkPushRequest.getPhoneNumber()));

                    log.info("Prepared ExternalStkPushRequest: {}", externalStkPushRequest);

                    String jsonRequest = HelperUtility.toJson(externalStkPushRequest);
                    log.debug("STK Push request JSON: {}", jsonRequest);

                    assert jsonRequest != null;
                    RequestBody body = RequestBody.create(jsonRequest, JSON_MEDIA_TYPE);

                    Request request = new Request.Builder()
                            .url(mpesaConfiguration.getStkPushRequestUrl())
                            .post(body)
                            .header(AUTHORIZATION_HEADER_STRING, String.format("%s %s", BEARER_AUTH_STRING, accessTokenResponse.getAccessToken()))
                            .build();

                    log.info("Sending STK Push request to URL: {}", mpesaConfiguration.getStkPushRequestUrl());

                    return executeRequest(request, StkPushSyncResponse.class)
                            .map(response -> {
                                log.info("STK Push response received: {}", response);
                                return response;
                            })
                            .orElseGet(() -> {
                                log.error("Failed to get STK Push response");
                                return null;
                            });
                })
                .exceptionally(ex -> {
                    log.error("Exception occurred during STK Push transaction", ex);
                    return null;
                })
                .join();
    }


    @Override
    public LNMQueryResponse getTransactionStatus(InternalLNMRequest internalLNMRequest) {
        MpesaConfiguration mpesaConfiguration =  mpesaConfigurationProvider.getMpesaConfiguration();
        return CompletableFuture.supplyAsync(this::getAccessToken)
                .thenApply(accessTokenResponse -> {
                    ExternalLNMQueryRequest externalLNMQueryRequest = new ExternalLNMQueryRequest();
                    externalLNMQueryRequest.setBusinessShortCode(mpesaConfiguration.getStkPushShortCode());

                    String requestTimestamp = HelperUtility.getTransactionTimestamp();
                    String stkPushPassword = HelperUtility.getStkPushPassword(mpesaConfiguration.getStkPushShortCode(),
                            mpesaConfiguration.getStkPassKey(), requestTimestamp);

                    externalLNMQueryRequest.setPassword(stkPushPassword);
                    externalLNMQueryRequest.setTimestamp(requestTimestamp);
                    externalLNMQueryRequest.setCheckoutRequestID(internalLNMRequest.getCheckoutRequestID());

                    RequestBody body = RequestBody.create(Objects.requireNonNull(HelperUtility.toJson(externalLNMQueryRequest)), JSON_MEDIA_TYPE);

                    Request request = new Request.Builder()
                            .url(mpesaConfiguration.getLnmQueryRequestUrl())
                            .post(body)
                            .header(AUTHORIZATION_HEADER_STRING, String.format("%s %s", BEARER_AUTH_STRING, accessTokenResponse.getAccessToken()))
                            .build();

                    return executeRequest(request, LNMQueryResponse.class)
                            .orElse(null);
                }).join();
    }

    private <T> Optional<T> executeRequest(Request request, Class<T> responseType) {
        try (Response response = okHttpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.error("Request failed with code: {}", response.code());
                return Optional.empty();
            }

            ResponseBody responseBody = response.body();
            if (responseBody == null) {
                log.error("Response body is null");
                return Optional.empty();
            }

            String responseString = responseBody.string();
            log.info("Raw response: {}", responseString);

            T result = objectMapperBuilder.build().readValue(responseString, responseType);
            return Optional.ofNullable(result);
        } catch (IOException e) {
            log.error("Error executing request: {}", e.getMessage());
            return Optional.empty();
        }
    }
}