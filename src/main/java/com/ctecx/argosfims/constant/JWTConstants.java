package com.ctecx.argosfims.constant;


import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

/**
 * @author Md. Amran Hossain
 */
public class JWTConstants {
    public static final long ACCESS_TOKEN_VALIDITY_SECONDS = 5*60*60;
    // Use a Base64-encoded key that's at least 256 bits (32 bytes) long
    public static final String SIGNING_KEY = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    public static SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SIGNING_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}