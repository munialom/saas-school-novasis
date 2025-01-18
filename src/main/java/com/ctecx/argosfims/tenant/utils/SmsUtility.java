package com.ctecx.argosfims.tenant.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class SmsUtility {
    private static final Logger logger = LoggerFactory.getLogger(SmsUtility.class);
    private static final String API_KEY = "a1e4d99bdcb95545251091c705d6a20543163e0a6c4bbb446565a6fb90b029db";
    private static final String BASE_URL = "https://api.africastalking.com/version1/messaging";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static SmsResult sendSms(String phone, String textM) {
        try {
            HttpResponse<String> response = Unirest.post(BASE_URL)
                    .header("apiKey", API_KEY)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Accept", "application/json")
                    .field("username", "saccomode")
                    .field("to", phone)
                    .field("message", textM)
                    .field("from", SmsConfig.getSenderId())
                    .field("enqueue", "1")
                    .asString();

            return parseSmsResponse(response.getBody());
        } catch (UnirestException ex) {
            logger.error("Network error while sending SMS: {}", ex.getMessage());
            return new SmsResult(false, true, 0, "NetworkError", "0", "", "Failed to send SMS due to network error", false);
        }
    }

    private static SmsResult parseSmsResponse(String responseBody) {
        try {
            Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);
            Map<String, Object> smsData = (Map<String, Object>) responseMap.get("SMSMessageData");
            String message = (String) smsData.get("Message");
            Map<String, Object> recipient = (Map<String, Object>) ((java.util.List) smsData.get("Recipients")).get(0);

            int statusCode = (int) recipient.get("statusCode");
            String status = (String) recipient.get("status");
            String cost = (String) recipient.get("cost");
            String messageId = (String) recipient.get("messageId");

            boolean isSuccess = statusCode == 100 || statusCode == 101 || statusCode == 102;
            boolean isRetryable = statusCode >= 500;
            boolean allowSend = isSuccess || statusCode == 405 || statusCode == 406;

            logSmsResult(statusCode, status, cost, messageId, message);

            return new SmsResult(isSuccess, isRetryable, statusCode, status, cost, messageId, message, allowSend);
        } catch (IOException e) {
            logger.error("Error parsing SMS response: {}", e.getMessage());
            return new SmsResult(false, false, 0, "ParseError", "0", "", "Failed to parse SMS response", false);
        }
    }

    private static void logSmsResult(int statusCode, String status, String cost, String messageId, String message) {
        switch (statusCode) {
            case 100, 101, 102 -> logger.info("SMS sent successfully. Status: {}, Cost: {}, MessageId: {}", status, cost, messageId);
            case 401 -> logger.warn("SMS held due to risk. Status: {}, MessageId: {}", status, messageId);
            case 402 -> logger.error("Invalid sender ID. Status: {}", status);
            case 403 -> logger.error("Invalid phone number. Status: {}", status);
            case 404 -> logger.error("Unsupported number type. Status: {}", status);
            case 405 -> logger.warn("Insufficient balance. Status: {}, Cost: {}", status, cost);
            case 406 -> logger.warn("User in blacklist. Status: {}", status);
            case 407 -> logger.error("Could not route message. Status: {}", status);
            case 409 -> logger.warn("Do Not Disturb rejection. Status: {}", status);
            case 500 -> logger.error("Internal server error. Status: {}", status);
            case 501 -> logger.error("Gateway error. Status: {}", status);
            case 502 -> logger.error("Rejected by gateway. Status: {}", status);
            default -> logger.warn("Unknown status code: {}. Message: {}", statusCode, message);
        }
    }

    public static class SmsResult {
        public final boolean isSuccess;
        public final boolean isRetryable;
        public final int statusCode;
        public final String status;
        public final String cost;
        public final String messageId;
        public final String message;
        public final boolean allowSend;

        public SmsResult(boolean isSuccess, boolean isRetryable, int statusCode, String status, String cost, String messageId, String message, boolean allowSend) {
            this.isSuccess = isSuccess;
            this.isRetryable = isRetryable;
            this.statusCode = statusCode;
            this.status = status;
            this.cost = cost;
            this.messageId = messageId;
            this.message = message;
            this.allowSend = allowSend;
        }
    }
}