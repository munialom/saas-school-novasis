package com.ctecx.argosfims.controller;



import com.ctecx.argosfims.constant.UserStatus;
import com.ctecx.argosfims.dto.AuthResponse;
import com.ctecx.argosfims.dto.UserLoginDTO;
import com.ctecx.argosfims.mastertenant.config.DBContextHolder;
import com.ctecx.argosfims.mastertenant.entity.MasterTenant;
import com.ctecx.argosfims.mastertenant.service.MasterTenantService;
import com.ctecx.argosfims.security.UserTenantInformation;
import com.ctecx.argosfims.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.annotation.ApplicationScope;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController implements Serializable {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);
    private static final long serialVersionUID = -8441722608331858292L;

    private final Map<String, String> mapValue = new HashMap<>();
    private final Map<String, String> userDbMap = new HashMap<>();

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private MasterTenantService masterTenantService;

    private String getSiteUrl(HttpServletRequest request) {
        String siteUrl = request.getRequestURL().toString();
        return siteUrl.replace(request.getServletPath(), "");
    }

    private Optional<Integer> resolveTenantIdFromDomain(HttpServletRequest request) {
        try {
            String domainUrl = getSiteUrl(request);

            LOGGER.debug("Resolving tenant for domain URL: {}", domainUrl);

            Optional<MasterTenant> masterTenantOpt = masterTenantService.findByDomainUrl(domainUrl);
            if (masterTenantOpt.isPresent()) {
                Integer tenantId = masterTenantOpt.get().getTenantClientId();
                LOGGER.debug("Resolved tenant ID {} from domain {}", tenantId, domainUrl);
                return Optional.of(tenantId);
            }

            LOGGER.debug("No tenant found for domain: {}", domainUrl);
            return Optional.empty();
        } catch (Exception ex) {
            LOGGER.error("Error resolving tenant from domain", ex);
            return Optional.empty();
        }
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> userLogin(@RequestBody @NotNull UserLoginDTO userLoginDTO,
                                       HttpServletRequest request) {
        LOGGER.info("Processing login request for user: {}", userLoginDTO.getUserName());

        try {
            // Validate input
            validateLoginRequest(userLoginDTO);

            // If tenantOrClientId is not provided, try to resolve from domain
            if (userLoginDTO.getTenantOrClientId() == null) {
                Optional<Integer> tenantId = resolveTenantIdFromDomain(request);
                if (tenantId.isPresent()) {
                    userLoginDTO.setTenantOrClientId(tenantId.get());
                    LOGGER.info("Resolved tenant ID {} from domain for user {}",
                            tenantId.get(), userLoginDTO.getUserName());
                } else {
                    throw new RuntimeException("Unable to resolve tenant. Please provide tenant ID or use correct domain.");
                }
            }

            // Validate and set tenant context
            MasterTenant masterTenant = validateAndGetTenant(userLoginDTO.getTenantOrClientId());

            // Set database context
            loadCurrentDatabaseInstance(masterTenant.getDbName(), userLoginDTO.getUserName());

            // Authenticate user
            Authentication authentication = authenticateUser(userLoginDTO);

            // Generate token and create response
            AuthResponse authResponse = createAuthenticationResponse(authentication, userLoginDTO.getTenantOrClientId());

            // Update metadata
            setMetaDataAfterLogin();

            return ResponseEntity.ok(authResponse);

        } catch (BadCredentialsException e) {
            LOGGER.error("Invalid credentials for user: {}", userLoginDTO.getUserName(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        } catch (RuntimeException e) {
            LOGGER.error("Login failed for user: {}", userLoginDTO.getUserName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // Rest of the methods remain unchanged
    private void validateLoginRequest(UserLoginDTO userLoginDTO) {
        if (userLoginDTO.getUserName() == null || userLoginDTO.getUserName().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (userLoginDTO.getPassword() == null || userLoginDTO.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
    }

    private MasterTenant validateAndGetTenant(Integer tenantId) {
        MasterTenant masterTenant = masterTenantService.findByClientId(tenantId);
        if (masterTenant == null || masterTenant.getStatus().toUpperCase().equals(UserStatus.INACTIVE)) {
            throw new RuntimeException("Invalid or inactive tenant. Please contact service provider.");
        }
        return masterTenant;
    }

    private Authentication authenticateUser(UserLoginDTO userLoginDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userLoginDTO.getUserName(),
                            userLoginDTO.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return authentication;
        } catch (AuthenticationException e) {
            LOGGER.error("Authentication failed for user: {}", userLoginDTO.getUserName(), e);
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    private AuthResponse createAuthenticationResponse(Authentication authentication, Integer tenantId) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(userDetails, String.valueOf(tenantId));

        return new AuthResponse(userDetails.getUsername(), token);
    }

    private void loadCurrentDatabaseInstance(String databaseName, String userName) {
        DBContextHolder.setCurrentDb(databaseName);
        mapValue.put(userName, databaseName);
    }

    @Bean(name = "userTenantInfo")
    @ApplicationScope
    public UserTenantInformation setMetaDataAfterLogin() {
        UserTenantInformation tenantInformation = new UserTenantInformation();

        if (!mapValue.isEmpty()) {
            userDbMap.putAll(new HashMap<>(mapValue));
            mapValue.clear();
        }

        tenantInformation.setMap(userDbMap);
        return tenantInformation;
    }
}