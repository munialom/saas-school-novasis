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
import java.util.stream.Collectors;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)  // Added this annotation to fix LazyInitializationException
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(userName);
        if(user == null) {
            throw new UsernameNotFoundException("Invalid user name or password.");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPassword(),
                user.isEnabled(),
                true,
                true,
                true,
                getAuthorities(user)
        );
    }

    private List<SimpleGrantedAuthority> getAuthorities(User user) {
        return user.getRoles().stream()
                .map(UserRole::getRoleName)
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList());
    }
}