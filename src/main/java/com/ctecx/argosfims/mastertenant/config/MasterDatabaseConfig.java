package com.ctecx.argosfims.mastertenant.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.ctecx.argosfims.mastertenant",
        entityManagerFactoryRef = "masterEntityManagerFactory",
        transactionManagerRef = "masterTransactionManager"
)
public class MasterDatabaseConfig {
    private static final Logger log = LoggerFactory.getLogger(MasterDatabaseConfig.class);
    private final MasterDatabaseConfigProperties masterDbProperties;

    public MasterDatabaseConfig(MasterDatabaseConfigProperties masterDbProperties) {
        this.masterDbProperties = masterDbProperties;
    }

    @Bean(name = "masterDataSource")
    @Primary
    public DataSource masterDataSource() {
        var hikariDataSource = new HikariDataSource();
        configureDataSource(hikariDataSource);
        log.info("Setup of masterDataSource succeeded.");
        return hikariDataSource;
    }

    @Primary
    @Bean(name = "masterEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean masterEntityManagerFactory() {
        var em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(masterDataSource());
        em.setPackagesToScan("com.ctecx.argosfims.mastertenant");
        em.setPersistenceUnitName("masterdb-persistence-unit");
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        em.setJpaProperties(hibernateProperties());

        log.info("Setup of masterEntityManagerFactory succeeded.");
        return em;
    }

    @Primary
    @Bean(name = "masterTransactionManager")
    public JpaTransactionManager masterTransactionManager(
            @Qualifier("masterEntityManagerFactory") EntityManagerFactory emf
    ) {
        return new JpaTransactionManager(emf);
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    private void configureDataSource(HikariDataSource dataSource) {
        dataSource.setUsername(masterDbProperties.getUsername());
        dataSource.setPassword(masterDbProperties.getPassword());
        dataSource.setJdbcUrl(masterDbProperties.getUrl());
        dataSource.setDriverClassName(masterDbProperties.getDriverClassName());
        dataSource.setPoolName(masterDbProperties.getPoolName());
        dataSource.setMaximumPoolSize(masterDbProperties.getMaxPoolSize());
        dataSource.setMinimumIdle(masterDbProperties.getMinIdle());
        dataSource.setConnectionTimeout(masterDbProperties.getConnectionTimeout());
        dataSource.setIdleTimeout(masterDbProperties.getIdleTimeout());
    }

    private Properties hibernateProperties() {
        var properties = new Properties();
        properties.put(org.hibernate.cfg.Environment.DIALECT, "org.hibernate.dialect.MySQLDialect");
        properties.put(org.hibernate.cfg.Environment.SHOW_SQL, true);
        properties.put(org.hibernate.cfg.Environment.FORMAT_SQL, true);
        properties.put(org.hibernate.cfg.Environment.HBM2DDL_AUTO, "none");
        return properties;
    }
}