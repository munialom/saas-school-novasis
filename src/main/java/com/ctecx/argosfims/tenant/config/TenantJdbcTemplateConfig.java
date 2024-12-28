package com.ctecx.argosfims.tenant.config;

import com.ctecx.argosfims.mastertenant.config.DBContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class TenantJdbcTemplateConfig {

    private static final Logger log = LoggerFactory.getLogger(TenantJdbcTemplateConfig.class);
    @Autowired
    @Qualifier("datasourceBasedMultitenantConnectionProvider")
    private DataSourceBasedMultiTenantConnectionProviderImpl multiTenantConnectionProvider;


    public JdbcTemplate getTenantJdbcTemplate() {
        return new JdbcTemplate(getTenantDataSource());
    }


    private DataSource getTenantDataSource() {
        String currentTenant = resolveCurrentTenantIdentifier();
        return multiTenantConnectionProvider.getDataSource(currentTenant);
    }

    private String resolveCurrentTenantIdentifier(){
        String currentTenantId = DBContextHolder.getCurrentDb();
        if(currentTenantId == null)
            throw new IllegalStateException("tenant cannot be null");
        return currentTenantId;
    }
}