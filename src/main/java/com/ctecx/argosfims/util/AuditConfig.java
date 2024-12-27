package com.ctecx.argosfims.util;

import com.ctecx.argosfims.tenant.users.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class AuditConfig {

    private final UserRepository userRepository;

    public AuditConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    AuditorAware<String> auditorAware() {
        return new AuditorAwareImpl(userRepository);
    }
}