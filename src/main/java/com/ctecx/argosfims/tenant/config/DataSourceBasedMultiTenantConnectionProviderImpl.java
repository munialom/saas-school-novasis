/*
package com.ctecx.argosfims.tenant.config;



import com.ctecx.argosfims.mastertenant.config.DBContextHolder;
import com.ctecx.argosfims.mastertenant.entity.MasterTenant;
import com.ctecx.argosfims.mastertenant.repository.MasterTenantRepository;
import com.ctecx.argosfims.util.DataSourceUtil;
import org.hibernate.engine.jdbc.connections.spi.AbstractDataSourceBasedMultiTenantConnectionProviderImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

*/
/**
 * @author Md. Amran Hossain
 *//*

@Configuration
public class DataSourceBasedMultiTenantConnectionProviderImpl extends AbstractDataSourceBasedMultiTenantConnectionProviderImpl<String> {
    private static final Logger LOG = LoggerFactory.getLogger(DataSourceBasedMultiTenantConnectionProviderImpl.class);
    private static final long serialVersionUID = 1L;

    private final Map<String, DataSource> dataSourcesMtApp = new TreeMap<>();

    @Autowired
    private MasterTenantRepository masterTenantRepository;

    @Autowired
    ApplicationContext applicationContext;

    @Override
    protected DataSource selectAnyDataSource() {
        // This method is called more than once. So check if the data source map
        // is empty. If it is then rescan master_tenant table for all tenant
        if (dataSourcesMtApp.isEmpty()) {
            List<MasterTenant> masterTenants = masterTenantRepository.findAll();
            LOG.info("selectAnyDataSource() method call...Total tenants:" + masterTenants.size());
            for (MasterTenant masterTenant : masterTenants) {
                dataSourcesMtApp.put(masterTenant.getDbName(),
                        DataSourceUtil.createAndConfigureDataSource(masterTenant));
            }
        }
        return this.dataSourcesMtApp.values().iterator().next();
    }

    @Override
    protected DataSource selectDataSource(String tenantIdentifier) {
        // If the requested tenant id is not present check for it in the master
        // database 'master_tenant' table
        String resolvedTenantId = initializeTenantIfLost(tenantIdentifier);

        if (!this.dataSourcesMtApp.containsKey(resolvedTenantId)) {
            List<MasterTenant> masterTenants = masterTenantRepository.findAll();
            LOG.info("selectDataSource() method call...Tenant:" + resolvedTenantId +
                    " Total tenants:" + masterTenants.size());

            for (MasterTenant masterTenant : masterTenants) {
                dataSourcesMtApp.put(masterTenant.getDbName(),
                        DataSourceUtil.createAndConfigureDataSource(masterTenant));
            }
        }

        // Check again if tenant exists in map after rescan master_db
        if (!this.dataSourcesMtApp.containsKey(resolvedTenantId)) {
            LOG.warn("Trying to get tenant:" + resolvedTenantId +
                    " which was not found in master db after rescan");
            throw new UsernameNotFoundException(String.format("Tenant not found after rescan, " +
                    " tenant=%s", resolvedTenantId));
        }

        return this.dataSourcesMtApp.get(resolvedTenantId);
    }

    private String initializeTenantIfLost(String tenantIdentifier) {
        if (tenantIdentifier != DBContextHolder.getCurrentDb()) {
            tenantIdentifier = DBContextHolder.getCurrentDb();
        }
        return tenantIdentifier;
    }
}*/




package com.ctecx.argosfims.tenant.config;

import com.ctecx.argosfims.mastertenant.config.DBContextHolder;
import com.ctecx.argosfims.mastertenant.entity.MasterTenant;
import com.ctecx.argosfims.mastertenant.repository.MasterTenantRepository;
import com.ctecx.argosfims.util.DataSourceUtil;
import org.hibernate.engine.jdbc.connections.spi.AbstractDataSourceBasedMultiTenantConnectionProviderImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * @author Md. Amran Hossain
 */
@Configuration
public class DataSourceBasedMultiTenantConnectionProviderImpl extends AbstractDataSourceBasedMultiTenantConnectionProviderImpl<String> {
    private static final Logger LOG = LoggerFactory.getLogger(DataSourceBasedMultiTenantConnectionProviderImpl.class);
    private static final long serialVersionUID = 1L;

    private final Map<String, DataSource> dataSourcesMtApp = new TreeMap<>();

    @Autowired
    private MasterTenantRepository masterTenantRepository;

    @Autowired
    ApplicationContext applicationContext;

    @Override
    protected DataSource selectAnyDataSource() {
        // This method is called more than once. So check if the data source map
        // is empty. If it is then rescan master_tenant table for all tenant
        if (dataSourcesMtApp.isEmpty()) {
            List<MasterTenant> masterTenants = masterTenantRepository.findAll();
            LOG.info("selectAnyDataSource() method call...Total tenants:" + masterTenants.size());
            for (MasterTenant masterTenant : masterTenants) {
                dataSourcesMtApp.put(masterTenant.getDbName(),
                        DataSourceUtil.createAndConfigureDataSource(masterTenant));
            }
        }
        return this.dataSourcesMtApp.values().iterator().next();
    }

    @Override
    protected DataSource selectDataSource(String tenantIdentifier) {
        // If the requested tenant id is not present check for it in the master
        // database 'master_tenant' table
        String resolvedTenantId = initializeTenantIfLost(tenantIdentifier);

        if (!this.dataSourcesMtApp.containsKey(resolvedTenantId)) {
            List<MasterTenant> masterTenants = masterTenantRepository.findAll();
            LOG.info("selectDataSource() method call...Tenant:" + resolvedTenantId +
                    " Total tenants:" + masterTenants.size());

            for (MasterTenant masterTenant : masterTenants) {
                dataSourcesMtApp.put(masterTenant.getDbName(),
                        DataSourceUtil.createAndConfigureDataSource(masterTenant));
            }
        }

        // Check again if tenant exists in map after rescan master_db
        if (!this.dataSourcesMtApp.containsKey(resolvedTenantId)) {
            LOG.warn("Trying to get tenant:" + resolvedTenantId +
                    " which was not found in master db after rescan");
            throw new UsernameNotFoundException(String.format("Tenant not found after rescan, " +
                    " tenant=%s", resolvedTenantId));
        }

        return this.dataSourcesMtApp.get(resolvedTenantId);
    }

    public DataSource getDataSource(String tenantIdentifier){
        String resolvedTenantId = initializeTenantIfLost(tenantIdentifier);
        if (!this.dataSourcesMtApp.containsKey(resolvedTenantId)) {
            List<MasterTenant> masterTenants = masterTenantRepository.findAll();
            LOG.info("selectDataSource() method call...Tenant:" + resolvedTenantId +
                    " Total tenants:" + masterTenants.size());

            for (MasterTenant masterTenant : masterTenants) {
                dataSourcesMtApp.put(masterTenant.getDbName(),
                        DataSourceUtil.createAndConfigureDataSource(masterTenant));
            }
        }

        // Check again if tenant exists in map after rescan master_db
        if (!this.dataSourcesMtApp.containsKey(resolvedTenantId)) {
            LOG.warn("Trying to get tenant:" + resolvedTenantId +
                    " which was not found in master db after rescan");
            throw new UsernameNotFoundException(String.format("Tenant not found after rescan, " +
                    " tenant=%s", resolvedTenantId));
        }

        return this.dataSourcesMtApp.get(resolvedTenantId);

    }

    private String initializeTenantIfLost(String tenantIdentifier) {
        if (tenantIdentifier != DBContextHolder.getCurrentDb()) {
            tenantIdentifier = DBContextHolder.getCurrentDb();
        }
        return tenantIdentifier;
    }
}