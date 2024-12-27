package com.ctecx.argosfims.tenant.config;

import jakarta.persistence.EntityManagerFactory;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.ctecx.argosfims.tenant",
        entityManagerFactoryRef = "tenantEntityManagerFactory",
        transactionManagerRef = "tenantTransactionManager"
)
@DependsOn("masterEntityManagerFactory")
public class TenantDatabaseConfig {

    @Bean(name = "tenantJpaVendorAdapter")
    public JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter();
    }

    @Bean(name = "tenantTransactionManager")
    @DependsOn("tenantEntityManagerFactory")
    public JpaTransactionManager transactionManager(
            @Qualifier("tenantEntityManagerFactory") EntityManagerFactory tenantEntityManager) {
        var transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(tenantEntityManager);
        return transactionManager;
    }

    @Bean(name = "datasourceBasedMultitenantConnectionProvider")
    @DependsOn("masterEntityManagerFactory")
    public MultiTenantConnectionProvider multiTenantConnectionProvider() {
        return new DataSourceBasedMultiTenantConnectionProviderImpl();
    }

    @Bean(name = "currentTenantIdentifierResolver")
    public CurrentTenantIdentifierResolver currentTenantIdentifierResolver() {
        return new CurrentTenantIdentifierResolverImpl();
    }

    @Bean(name = "tenantEntityManagerFactory")
    @DependsOn({"datasourceBasedMultitenantConnectionProvider", "masterEntityManagerFactory"})
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            @Qualifier("datasourceBasedMultitenantConnectionProvider") MultiTenantConnectionProvider connectionProvider,
            @Qualifier("currentTenantIdentifierResolver") CurrentTenantIdentifierResolver tenantResolver) {

        var emfBean = new LocalContainerEntityManagerFactoryBean();
        emfBean.setPackagesToScan("com.ctecx.argosfims.tenant");
        emfBean.setJpaVendorAdapter(jpaVendorAdapter());
        emfBean.setPersistenceUnitName("tenantdb-persistence-unit");

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.multiTenancy", "DATABASE");
        properties.put("hibernate.tenant_identifier_resolver", tenantResolver);
        properties.put("hibernate.multi_tenant_connection_provider", connectionProvider);
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        properties.put("hibernate.show_sql", true);
        properties.put("hibernate.format_sql", true);
        properties.put("hibernate.hbm2ddl.auto", "none");


        emfBean.setJpaPropertyMap(properties);
        return emfBean;
    }
}