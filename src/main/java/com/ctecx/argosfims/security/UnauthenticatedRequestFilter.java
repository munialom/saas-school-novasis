package com.ctecx.argosfims.security;

import com.ctecx.argosfims.mastertenant.config.DBContextHolder;
import com.ctecx.argosfims.mastertenant.entity.MasterTenant;
import com.ctecx.argosfims.mastertenant.service.MasterTenantService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Optional;

@Component
public class UnauthenticatedRequestFilter extends OncePerRequestFilter {

    private static final Logger LOG = LoggerFactory.getLogger(UnauthenticatedRequestFilter.class);


    @Autowired
    private MasterTenantService masterTenantService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        // Check if the request URI starts with "/api/unauthenticated"
        if (requestURI.startsWith("/api/unauthenticated") && "POST".equalsIgnoreCase(request.getMethod())) {
            try {
                String siteUrl = getSiteUrl(request);
                Optional<MasterTenant> optionalTenant = masterTenantService.findByDomainUrl(siteUrl);

                if (optionalTenant.isEmpty()) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Tenant not found");
                    return;
                }

                MasterTenant tenant = optionalTenant.get();
                DBContextHolder.setCurrentDb(tenant.getDbName());
                filterChain.doFilter(request, response);
            } catch (Exception e) {
                LOG.error("Error in unauthenticated filter: ", e);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error");
            } finally {
                DBContextHolder.clear();
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private String getSiteUrl(HttpServletRequest request) {
        String siteUrl = request.getRequestURL().toString();
        return siteUrl.replace(request.getServletPath(), "");
    }
}