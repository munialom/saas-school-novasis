package com.ctecx.argosfims.tenant.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SmsConfig {

    private static String senderId;

    @Value("${sms.sender.id}")
    public void setSenderId(String senderId) {
        SmsConfig.senderId = senderId;
    }

    public static String getSenderId() {
        return senderId;
    }
}

