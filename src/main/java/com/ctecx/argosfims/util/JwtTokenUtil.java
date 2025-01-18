package com.ctecx.argosfims.util;



import com.ctecx.argosfims.constant.JWTConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtTokenUtil implements Serializable {

    private static final long serialVersionUID = -2550185165626007488L;

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public String getAudienceFromToken(String token) {
        return getClaimFromToken(token, claims -> {
            var audience = claims.getAudience();
            return audience != null && !audience.isEmpty() ? audience.iterator().next() : null;
        });
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(JWTConstants.getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails, String tenantOrClientId) {
        return doGenerateToken(userDetails, tenantOrClientId);
    }


    private String doGenerateToken(UserDetails userDetails, String tenantOrClientId) {
        Map<String, Object> claims = new HashMap<>();
        List<String> authorities=userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        System.out.println("Authorities inside tokenUtil " + authorities); //Debug purpose
        // Add user roles to token claims
        claims.put("scopes", authorities); //Set a breakpoint here

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .audience().add(tenantOrClientId).and()
                .issuer("system")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() +
                        JWTConstants.ACCESS_TOKEN_VALIDITY_SECONDS * 1000))
                .signWith(JWTConstants.getSigningKey())
                .compact();
    }

/*    private String doGenerateToken(UserDetails userDetails, String tenantOrClientId) {
        Map<String, Object> claims = new HashMap<>();

        // Add user roles to token claims
        claims.put("scopes", userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .audience().add(tenantOrClientId).and()
                .issuer("system")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() +
                        JWTConstants.ACCESS_TOKEN_VALIDITY_SECONDS * 1000))
                .signWith(JWTConstants.getSigningKey())
                .compact();
    }*/

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}