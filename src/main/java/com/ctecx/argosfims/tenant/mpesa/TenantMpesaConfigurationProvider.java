package com.ctecx.argosfims.tenant.mpesa;


import com.ctecx.argosfims.tenant.services.MpesaConfiguration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.List;

@Component
@RequestScope
@RequiredArgsConstructor
@Slf4j
public class TenantMpesaConfigurationProvider {
    private final MpesaConfigService mpesaConfigService;

    public MpesaConfiguration getMpesaConfiguration() {
        //This is just an example we have one configuration.
        List<MpesaConfigEntity> configEntityList = mpesaConfigService.getAllConfigurations();

        if(configEntityList.isEmpty()){
            log.error("Failed to load Mpesa configurations from database");
            return null;
        }

        MpesaConfigEntity configEntity = configEntityList.get(0);

        MpesaConfiguration mpesaConfiguration = new MpesaConfiguration();
        mpesaConfiguration.setConsumerKey(configEntity.getConsumerKey());
        mpesaConfiguration.setConsumerSecret(configEntity.getConsumerSecret());
        mpesaConfiguration.setGrantType(configEntity.getGrantType());
        mpesaConfiguration.setOauthEndpoint(configEntity.getOauthEndpoint());
        mpesaConfiguration.setRegisterUrlEndpoint(configEntity.getRegisterUrlEndpoint());
        mpesaConfiguration.setSimulateTransactionEndpoint(configEntity.getSimulateTransactionEndpoint());
        mpesaConfiguration.setShortCode(configEntity.getShortCode());
        mpesaConfiguration.setConfirmationURL(configEntity.getConfirmationURL());
        mpesaConfiguration.setValidationURL(configEntity.getValidationURL());
        mpesaConfiguration.setResponseType(configEntity.getResponseType());
        mpesaConfiguration.setB2cTransactionEndpoint(configEntity.getB2cTransactionEndpoint());
        mpesaConfiguration.setB2cResultUrl(configEntity.getB2cResultUrl());
        mpesaConfiguration.setB2cQueueTimeoutUrl(configEntity.getB2cQueueTimeoutUrl());
        mpesaConfiguration.setB2cInitiatorName(configEntity.getB2cInitiatorName());
        mpesaConfiguration.setB2cInitiatorPassword(configEntity.getB2cInitiatorPassword());
        mpesaConfiguration.setTransactionResultUrl(configEntity.getTransactionResultUrl());
        mpesaConfiguration.setCheckAccountBalanceUrl(configEntity.getCheckAccountBalanceUrl());
        mpesaConfiguration.setStkPassKey(configEntity.getStkPassKey());
        mpesaConfiguration.setStkPushShortCode(configEntity.getStkPushShortCode());
        mpesaConfiguration.setStkPushRequestUrl(configEntity.getStkPushRequestUrl());
        mpesaConfiguration.setStkPushRequestCallbackUrl(configEntity.getStkPushRequestCallbackUrl());
        mpesaConfiguration.setLnmQueryRequestUrl(configEntity.getLnmQueryRequestUrl());
        mpesaConfiguration.setProduction(configEntity.isProduction());
        log.info("Mpesa configuration loaded for tenant.");
        return mpesaConfiguration;
    }
}