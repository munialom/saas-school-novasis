/*
package com.ctecx.argosfims.mastertenant.config;



import com.ctecx.argosfims.mastertenant.entity.MasterTenant;
import com.zaxxer.hikari.HikariDataSource;
import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Configuration
public class FlywayConfig {
    private static final Logger log = LoggerFactory.getLogger(FlywayConfig.class);

    private final DataSource masterDataSource;
    private static final String MASTER_MIGRATION_LOCATION = "classpath:db/migration/master";
    private static final String TENANT_MIGRATION_LOCATION = "classpath:db/migration/tenant";
    private static final int BATCH_SIZE = 10;
    private static final int MIGRATION_TIMEOUT_MINUTES = 30;

    public FlywayConfig(@Qualifier("masterDataSource") DataSource masterDataSource) {
        this.masterDataSource = masterDataSource;
    }

    @Bean
    @Primary
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            try {
                migrateMasterDatabase();
                migrateAllTenantDatabases();
            } catch (Exception e) {
                log.error("Migration failed", e);
                throw new RuntimeException("Migration failed: " + e.getMessage(), e);
            }
        };
    }

    private void migrateMasterDatabase() {
        log.info("Migrating master database");
        Flyway flyway = Flyway.configure()
                .dataSource(masterDataSource)
                .locations(MASTER_MIGRATION_LOCATION)
                .baselineOnMigrate(true)
                .baselineVersion("0")
                .validateOnMigrate(true)
                .outOfOrder(true)
                .load();

        try {
            flyway.migrate();
            log.info("Master database migration completed successfully");
        } catch (Exception e) {
            log.error("Master database migration failed", e);
            throw new RuntimeException("Master database migration failed", e);
        }
    }

    @Transactional
    public void migrateAllTenantDatabases() {
        log.info("Starting batch migration for all tenant databases");
        List<MasterTenant> tenants = fetchActiveTenants();

        if (tenants.isEmpty()) {
            log.info("No active tenants found to migrate");
            return;
        }

        ExecutorService executorService = Executors.newFixedThreadPool(BATCH_SIZE);
        CompletionService<MigrationResult> completionService = new ExecutorCompletionService<>(executorService);
        Map<Future<MigrationResult>, MasterTenant> migrationTasks = new HashMap<>();
        List<MigrationResult> results = new ArrayList<>();

        try {
            for (MasterTenant tenant : tenants) {
                Future<MigrationResult> future = completionService.submit(() -> migrateTenantDatabase(tenant));
                migrationTasks.put(future, tenant);
            }

            long deadline = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(MIGRATION_TIMEOUT_MINUTES);

            for (int i = 0; i < tenants.size(); i++) {
                try {
                    long remainingTime = deadline - System.currentTimeMillis();
                    if (remainingTime <= 0) {
                        throw new TimeoutException("Migration timeout exceeded");
                    }

                    Future<MigrationResult> completed = completionService.poll(remainingTime, TimeUnit.MILLISECONDS);
                    if (completed == null) {
                        throw new TimeoutException("Migration timeout exceeded");
                    }

                    MigrationResult result = completed.get();
                    results.add(result);

                } catch (Exception e) {
                    log.error("Error during tenant migration batch", e);
                    cancelRemainingTasks(migrationTasks);
                    throw new RuntimeException("Batch migration failed", e);
                }
            }

            processResults(results);

        } finally {
            executorService.shutdownNow();
        }
    }

    private void cancelRemainingTasks(Map<Future<MigrationResult>, MasterTenant> tasks) {
        for (Map.Entry<Future<MigrationResult>, MasterTenant> entry : tasks.entrySet()) {
            if (!entry.getKey().isDone()) {
                entry.getKey().cancel(true);
                log.warn("Cancelled migration for tenant: {}", entry.getValue().getDbName());
            }
        }
    }

    private void processResults(List<MigrationResult> results) {
        int successCount = 0;
        List<String> failedTenants = new ArrayList<>();

        for (MigrationResult result : results) {
            if (result.isSuccess()) {
                successCount++;
            } else {
                failedTenants.add(result.getTenantName() + " (Error: " + result.getErrorMessage() + ")");
            }
        }

        log.info("Migration batch completed. Successful: {}, Failed: {}", successCount, failedTenants.size());

        if (!failedTenants.isEmpty()) {
            log.error("Failed tenants: {}", String.join(", ", failedTenants));
            throw new RuntimeException("Some tenant migrations failed. Failed count: " + failedTenants.size());
        }
    }

    private List<MasterTenant> fetchActiveTenants() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(masterDataSource);
        List<Map<String, Object>> tenants = jdbcTemplate.queryForList(
                "SELECT * FROM tbl_tenant_master WHERE status = 'ACTIVE'"
        );
        return tenants.stream()
                .map(this::mapToTenant)
                .collect(Collectors.toList());
    }

    private MasterTenant mapToTenant(Map<String, Object> tenantMap) {
        MasterTenant tenant = new MasterTenant();

        Object tenantClientId = tenantMap.get("tenant_client_id");
        if (tenantClientId instanceof Number) {
            tenant.setTenantClientId(((Number) tenantClientId).intValue());
        }

        tenant.setDbName((String) tenantMap.get("db_name"));
        tenant.setUrl((String) tenantMap.get("url"));
        tenant.setUserName((String) tenantMap.get("user_name"));
        tenant.setPassword((String) tenantMap.get("password"));
        tenant.setDriverClass((String) tenantMap.get("driver_class"));
        tenant.setStatus((String) tenantMap.get("status"));

        return tenant;
    }

    private MigrationResult migrateTenantDatabase(MasterTenant tenant) {
        log.info("Migrating tenant database: {}", tenant.getDbName());
        DataSource tenantDataSource = null;

        try {
            tenantDataSource = createTenantDataSource(tenant);
            Flyway flyway = Flyway.configure()
                    .dataSource(tenantDataSource)
                    .locations(TENANT_MIGRATION_LOCATION)
                    .baselineOnMigrate(true)
                    .baselineVersion("0")
                    .validateOnMigrate(true)
                    .outOfOrder(true)
                    .load();

            flyway.migrate();
            log.info("Tenant database migration completed successfully for: {}", tenant.getDbName());
            return new MigrationResult(tenant.getDbName(), true, null);

        } catch (Exception e) {
            String errorMessage = String.format("Failed to migrate tenant database: %s. Error: %s",
                    tenant.getDbName(), e.getMessage());
            log.error(errorMessage, e);
            return new MigrationResult(tenant.getDbName(), false, errorMessage);
        } finally {
            if (tenantDataSource instanceof HikariDataSource) {
                ((HikariDataSource) tenantDataSource).close();
            }
        }
    }

    private DataSource createTenantDataSource(MasterTenant tenant) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setUsername(tenant.getUserName());
        dataSource.setPassword(tenant.getPassword());
        dataSource.setJdbcUrl(tenant.getUrl());
        dataSource.setDriverClassName(tenant.getDriverClass());
        dataSource.setPoolName(tenant.getDbName() + "-migration-pool");

        // Conservative pool settings for migration
        dataSource.setMaximumPoolSize(2);
        dataSource.setMinimumIdle(1);
        dataSource.setConnectionTimeout(20000);
        dataSource.setIdleTimeout(300000);
        dataSource.setMaxLifetime(600000);

        return dataSource;
    }

    private static class MigrationResult {
        private final String tenantName;
        private final boolean success;
        private final String errorMessage;

        public MigrationResult(String tenantName, boolean success, String errorMessage) {
            this.tenantName = tenantName;
            this.success = success;
            this.errorMessage = errorMessage;
        }

        public String getTenantName() {
            return tenantName;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }
}*/
