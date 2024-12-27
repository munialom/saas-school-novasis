package com.ctecx.argosfims.security;


import com.ctecx.argosfims.constant.JWTConstants;
import com.ctecx.argosfims.mastertenant.config.DBContextHolder;
import com.ctecx.argosfims.mastertenant.entity.MasterTenant;
import com.ctecx.argosfims.mastertenant.service.MasterTenantService;
import com.ctecx.argosfims.util.JwtTokenUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private MasterTenantService masterTenantService;




    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = extractToken(request);
            if (token != null) {
                processToken(token, request);
            }
        } catch (Exception ex) {
            logger.error("Authentication error: ", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader(JWTConstants.HEADER_STRING);
        if (header != null && header.startsWith(JWTConstants.TOKEN_PREFIX)) {
            return header.substring(JWTConstants.TOKEN_PREFIX.length());
        }
        return null;
    }

    private void processToken(String token, HttpServletRequest request) {
        try {
            String username = jwtTokenUtil.getUsernameFromToken(token);
            String audience = jwtTokenUtil.getAudienceFromToken(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                setTenantContext(audience);
                authenticateUser(username, token, request);
            }
        } catch (ExpiredJwtException ex) {
            logger.warn("JWT token has expired", ex);
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature", ex);
        } catch (JwtException ex) {
            logger.error("Invalid JWT token", ex);
        } catch (Exception ex) {
            logger.error("Authentication error", ex);
        }
    }

    // Keeping the original setTenantContext method unchanged
    private void setTenantContext(String audience) {
        if (audience == null) {
            throw new BadCredentialsException("Invalid tenant information in token");
        }

        try {
            MasterTenant masterTenant = masterTenantService.findByClientId(Integer.valueOf(audience));
            if (masterTenant == null) {
                throw new BadCredentialsException("Invalid tenant");
            }
            DBContextHolder.setCurrentDb(masterTenant.getDbName());
        } catch (NumberFormatException ex) {
            throw new BadCredentialsException("Invalid tenant format");
        }
    }

    private void authenticateUser(String username, String token, HttpServletRequest request) {
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(username);

        if (jwtTokenUtil.validateToken(token, userDetails)) {
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.debug("Authenticated user {} with roles {}");
        }
    }
}