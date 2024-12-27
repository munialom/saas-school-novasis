package com.ctecx.argosfims.tenant.config;


import com.ctecx.argosfims.mastertenant.config.DBContextHolder;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;

/**
 * @author Md. Amran Hossain
 */
public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver<String> {
    private static final String DEFAULT_TENANT_ID = "client_tenant_1";

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenant = DBContextHolder.getCurrentDb();
        return StringUtils.isNotBlank(tenant) ? tenant : DEFAULT_TENANT_ID;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}