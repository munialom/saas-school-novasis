package com.ctecx.argosfims.security;


import com.ctecx.argosfims.tenant.userroles.UserRole;
import com.ctecx.argosfims.tenant.users.User;
import com.ctecx.argosfims.tenant.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
public class JwtUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(userName);
        if(user == null) {
            throw new UsernameNotFoundException("Invalid user name or password.");
        }

        System.out.println("Found user: " + user.getUserName());
        System.out.println("User roles set is null? " + (user.getRoles() == null));
        System.out.println("User roles size: " + (user.getRoles() != null ? user.getRoles().size() : "N/A"));

        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> {
                System.out.println("Role: " + role.getRoleName());
            });
        }

        List<SimpleGrantedAuthority> authorities = getAuthorities(user);
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPassword(),
                user.isEnabled(),
                true,
                true,
                true,
                authorities
        );
    }

    private List<SimpleGrantedAuthority> getAuthorities(User user) {
        if (user.getRoles() == null) {
            System.out.println("Roles set is null for user: " + user.getUserName());
            return List.of(new SimpleGrantedAuthority("ROLE_USER")); // Default role
        }

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .filter(Objects::nonNull)
                .map(UserRole::getRoleName)
                .filter(Objects::nonNull)
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList());

        System.out.println("Authorities for user " + user.getUserName() + ": " + authorities);
        return authorities.isEmpty() ?
                List.of(new SimpleGrantedAuthority("ROLE_USER")) :
                authorities;
    }
}