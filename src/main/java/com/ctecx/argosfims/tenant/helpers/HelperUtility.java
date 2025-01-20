package com.ctecx.argosfims.tenant.helpers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.CharacterPredicates;
import org.apache.commons.text.RandomStringGenerator;
import org.bouncycastle.util.encoders.Base64;

import javax.crypto.Cipher;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.security.Security;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Contains a set of helper functions.
 */
@Slf4j
public class HelperUtility {

    /**
     * @param value the value to be converted to a base64 string
     * @return returns base64String
     */
    public static String toBase64String(String value) {
        byte[] data = value.getBytes(StandardCharsets.ISO_8859_1);
        return Base64.toBase64String(data);
    }
    public static String toJson(Object object) {
        try {
            return new ObjectMapper().writeValueAsString(object);
        } catch (JsonProcessingException exception) {
            return null;
        }
    }

/*    @SneakyThrows
    public static String getSecurityCredentials(String initiatorPassword) {
        try {
            Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
            byte[] input = initiatorPassword.getBytes(StandardCharsets.UTF_8);

            //Resource resource = new ClassPathResource("SandboxCertificate.cer");ProductionCertificate
            Resource resource = new ClassPathResource("ProductionCertificate.cer");
            try (InputStream inputStream = resource.getInputStream()) {
                CertificateFactory cf = CertificateFactory.getInstance("X.509");
                X509Certificate certificate = (X509Certificate) cf.generateCertificate(inputStream);
                PublicKey pk = certificate.getPublicKey();

                Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding", "BC");
                cipher.init(Cipher.ENCRYPT_MODE, pk);

                byte[] cipherText = cipher.doFinal(input);
                return Base64.toBase64String(cipherText).trim();
            }
        } catch (Exception e) {
            log.error("Error generating security credentials", e);
            throw new RuntimeException("Failed to generate security credentials", e);
        }
    }*/


    @SneakyThrows
    public static String getSecurityCredentials(String initiatorPassword) {
        try {
            Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
            byte[] input = initiatorPassword.getBytes(StandardCharsets.UTF_8);

            String certificatePath = "ProductionCertificate.cer";
            InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(certificatePath);

            if (inputStream == null) {
                throw new FileNotFoundException("Certificate file not found: " + certificatePath);
            }

            try (inputStream) {
                CertificateFactory cf = CertificateFactory.getInstance("X.509");
                X509Certificate certificate = (X509Certificate) cf.generateCertificate(inputStream);
                PublicKey pk = certificate.getPublicKey();

                Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding", "BC");
                cipher.init(Cipher.ENCRYPT_MODE, pk);
                byte[] cipherText = cipher.doFinal(input);

                return Base64.toBase64String(cipherText).trim();
            }
        } catch (Exception e) {
            log.error("Error generating security credentials", e);
            throw new RuntimeException("Failed to generate security credentials", e);
        }
    }


    public static String getTransactionUniqueNumber() {
        RandomStringGenerator stringGenerator = new RandomStringGenerator.Builder()
                .withinRange('0', 'z')
                .filteredBy(CharacterPredicates.LETTERS, CharacterPredicates.DIGITS)
                .build();
        String transactionNumber=stringGenerator.generate(12).toUpperCase();
        log.info(String.format("Transaction Number: %s", transactionNumber));
        return transactionNumber;
    }

    public static String getStkPushPassword(String shortCode, String passKey, String timestamp) {
        String concatenatedString = String.format("%s%s%s", shortCode, passKey, timestamp);
        return toBase64String(concatenatedString);
    }

    public static String getTransactionTimestamp() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        return dateFormat.format(new Date());
    }
}
