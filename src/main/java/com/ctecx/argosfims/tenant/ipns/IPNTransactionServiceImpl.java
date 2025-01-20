package com.ctecx.argosfims.tenant.ipns;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class IPNTransactionServiceImpl implements IPNTransactionService {
    private final IPNTransactionRepository ipnTransactionRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    private static final  String PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDSPmQ5ZcHve72h5oa2uxPCrzSlN62fozMz7pISZ2AiV1Vb6O0Puhg/93xfkSHhaYFXpzI3vfs1elZYHr+0tVbu2RcJC9Y9mdIkhssf6DNKHI6aEwWp/hi3oCiKsyHuTwmF+UPWaNWxEy1kK0K6MOZSB3FZyK5w3B4yQ6kpPY6QJQIDAQAB";


    @Override
    @Transactional
    public IPNResponse processIPNTransaction(IPNRequest ipnRequest, String signature) {
        String transactionRef = ipnRequest.getTransactionReference();
        log.info("Processing IPN transaction: {} with signature: {}", transactionRef, signature);

        try {

            // Check for duplicate transaction
            if (ipnTransactionRepository.existsByTransactionReference(transactionRef)) {
                log.warn("Duplicate transaction detected: {}", transactionRef);
                return buildErrorResponse(transactionRef, "Duplicate transaction");
            }
            // Convert request to JSON for signature verification
            String payload = objectMapper.writeValueAsString(ipnRequest);
            log.debug("Verification payload: {}", payload);

            // Verify signature if provided
            if (signature != null && !signature.trim().isEmpty()) {
                boolean signatureValid = verifySignature(payload, signature);
                if (!signatureValid) {
                    log.warn("Signature verification failed for transaction: {}", transactionRef);
                    return buildErrorResponse(transactionRef, "Invalid signature");
                }
            }

            // Save the transaction with safe conversion
            IPNTransaction savedTransaction = ipnTransactionRepository.save(safeConvertToTransaction(ipnRequest));



            // Publish event asynchronously
            eventPublisher.publishEvent(new IPNTransactionEvent(this, savedTransaction));
            log.info("Successfully saved transaction: {}", savedTransaction.getTransactionReference());

            return IPNResponse.builder()
                    .transactionID(transactionRef)
                    .statusCode(0)
                    .statusMessage("Transaction processed successfully")
                    .build();

        } catch (Exception e) {
            log.error("Error processing IPN transaction: {}", transactionRef, e);
            return buildErrorResponse(transactionRef, "Processing error: " + e.getMessage());
        }
    }

    private IPNTransaction safeConvertToTransaction(IPNRequest request) {
        IPNTransaction transaction = new IPNTransaction();

        // Set the transaction reference as it's our minimal requirement
        transaction.setTransactionReference(request.getTransactionReference());

        // Safely set other fields
        try {
            if (request.getTransactionAmount() != null && !request.getTransactionAmount().trim().isEmpty()) {
                transaction.setTransactionAmount(new BigDecimal(request.getTransactionAmount()));
            }
            if (request.getBalance() != null && !request.getBalance().trim().isEmpty()) {
                transaction.setBalance(new BigDecimal(request.getBalance()));
            }
        } catch (NumberFormatException e) {
            log.warn("Error converting numeric values for transaction {}: {}",
                    request.getTransactionReference(), e.getMessage());
            // Set to zero if conversion fails
            transaction.setTransactionAmount(BigDecimal.ZERO);
            transaction.setBalance(BigDecimal.ZERO);
        }

        // Set string fields directly - they can be null
        transaction.setRequestId(request.getRequestId());
        transaction.setChannelCode(request.getChannelCode());
        transaction.setTimestamp(request.getTimestamp());
        transaction.setCurrency(request.getCurrency());
        transaction.setCustomerReference(request.getCustomerReference());
        transaction.setCustomerName(request.getCustomerName());
        transaction.setCustomerMobileNumber(request.getCustomerMobileNumber());
        transaction.setNarration(request.getNarration());
        transaction.setCreditAccountIdentifier(request.getCreditAccountIdentifier());
        transaction.setOrganizationShortCode(request.getOrganizationShortCode());
        transaction.setTillNumber(request.getTillNumber());
        transaction.setCreatedBy("automated");
        transaction.setModifiedBy("automated");

        return transaction;
    }

    private boolean verifySignature(String payload, String signature) {
        try {
            // Clean up the signature first
            String cleanedSignature = cleanSignature(signature);
            log.debug("Cleaned signature: {}", cleanedSignature);
            log.debug("Payload to verify: {}", payload);

            // Decode the base64 public key
            byte[] publicKeyBytes = Base64.getDecoder().decode(PUBLIC_KEY);

            // Create public key specification
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey publicKey = keyFactory.generatePublic(keySpec);

            // Create signature instance
            Signature sig = Signature.getInstance("SHA256withRSA");
            sig.initVerify(publicKey);

            // Update with payload bytes using explicit encoding
            byte[] payloadBytes = payload.getBytes("UTF-8");
            sig.update(payloadBytes);

            // Decode signature and verify
            byte[] signatureBytes = Base64.getDecoder().decode(cleanedSignature);
            log.debug("Decoded signature length: {} bytes", signatureBytes.length);

            boolean verified = sig.verify(signatureBytes);
            log.debug("Signature verification result: {}", verified);
            return verified;

        } catch (IllegalArgumentException e) {
            log.error("Invalid Base64 encoding in signature: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Error verifying signature: {}", e.getMessage());
            return false;
        }
    }

    private String cleanSignature(String signature) {
        return signature == null ? "" : signature.replaceAll("[^A-Za-z0-9+/=]", "");
    }

    private IPNResponse buildErrorResponse(String transactionId, String message) {
        log.error("Building error response for transaction {}: {}", transactionId, message);
        return IPNResponse.builder()
                .transactionID(transactionId)
                .statusCode(1)
                .statusMessage("Error: " + message)
                .build();
    }
}