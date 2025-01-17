package com.ctecx.argosfims.util;

import com.ctecx.argosfims.tenant.users.User;
import com.ctecx.argosfims.tenant.users.UserRepository;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {

    private final UserRepository userRepository;

    public AuditorAwareImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<String> getCurrentAuditor() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.empty();
            }

            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                User user = userRepository.findByUserName(userDetails.getUsername());

                if (user != null) {
                    return Optional.of(user.getFullName());
                }
            }

            // Fallback to just username if something goes wrong
            return Optional.of(authentication.getName());

        } catch (Exception e) {
            // Fallback in case of any error
            return Optional.of("system");
        }
    }
}