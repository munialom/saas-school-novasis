package com.ctecx.argosfims.tenant.mpesa;


import com.ctecx.argosfims.tenant.mpesa.MpesaConfigEntity;
import com.ctecx.argosfims.tenant.mpesa.MpesaConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class MpesaConfigService {
    private final MpesaConfigRepository mpesaConfigRepository;

    public List<MpesaConfigEntity> getAllConfigurations(){
        return mpesaConfigRepository.findAll();
    }

    public MpesaConfigEntity getConfigurationById(Long id){
        return  mpesaConfigRepository.findById(id)
                .orElseThrow(()-> new NoSuchElementException("Mpesa configuration with ID "+id +" Not found"));
    }
    public  MpesaConfigEntity createConfiguration(MpesaConfigEntity mpesaConfigEntity){
        return  mpesaConfigRepository.save(mpesaConfigEntity);
    }

    public MpesaConfigEntity updateConfiguration(Long id,MpesaConfigEntity mpesaConfigEntity){
        MpesaConfigEntity existingConfig=getConfigurationById(id);
        existingConfig.setConsumerKey(mpesaConfigEntity.getConsumerKey());
        existingConfig.setConsumerSecret(mpesaConfigEntity.getConsumerSecret());
        existingConfig.setGrantType(mpesaConfigEntity.getGrantType());
        existingConfig.setOauthEndpoint(mpesaConfigEntity.getOauthEndpoint());
        existingConfig.setRegisterUrlEndpoint(mpesaConfigEntity.getRegisterUrlEndpoint());
        existingConfig.setSimulateTransactionEndpoint(mpesaConfigEntity.getSimulateTransactionEndpoint());
        existingConfig.setShortCode(mpesaConfigEntity.getShortCode());
        existingConfig.setConfirmationURL(mpesaConfigEntity.getConfirmationURL());
        existingConfig.setValidationURL(mpesaConfigEntity.getValidationURL());
        existingConfig.setResponseType(mpesaConfigEntity.getResponseType());
        existingConfig.setB2cTransactionEndpoint(mpesaConfigEntity.getB2cTransactionEndpoint());
        existingConfig.setB2cResultUrl(mpesaConfigEntity.getB2cResultUrl());
        existingConfig.setB2cQueueTimeoutUrl(mpesaConfigEntity.getB2cQueueTimeoutUrl());
        existingConfig.setB2cInitiatorName(mpesaConfigEntity.getB2cInitiatorName());
        existingConfig.setB2cInitiatorPassword(mpesaConfigEntity.getB2cInitiatorPassword());
        existingConfig.setTransactionResultUrl(mpesaConfigEntity.getTransactionResultUrl());
        existingConfig.setCheckAccountBalanceUrl(mpesaConfigEntity.getCheckAccountBalanceUrl());
        existingConfig.setStkPassKey(mpesaConfigEntity.getStkPassKey());
        existingConfig.setStkPushShortCode(mpesaConfigEntity.getStkPushShortCode());
        existingConfig.setStkPushRequestUrl(mpesaConfigEntity.getStkPushRequestUrl());
        existingConfig.setStkPushRequestCallbackUrl(mpesaConfigEntity.getStkPushRequestCallbackUrl());
        existingConfig.setLnmQueryRequestUrl(mpesaConfigEntity.getLnmQueryRequestUrl());
        existingConfig.setProduction(mpesaConfigEntity.isProduction());

        return mpesaConfigRepository.save(existingConfig);
    }

    public void deleteConfiguration(Long id){
        mpesaConfigRepository.deleteById(id);
    }


}