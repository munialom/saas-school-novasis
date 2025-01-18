// UserService.java
package com.ctecx.argosfims.tenant.users;

import com.ctecx.argosfims.tenant.userroles.UserRole;
import com.ctecx.argosfims.tenant.userroles.UserRoleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    public User createUser(UserDTO userDTO) {
        // Check if a user with the given username already exists
        Optional<User> existingUser = Optional.ofNullable(userRepository.findByUserName(userDTO.getUserName()));
        if (existingUser.isPresent()) {
            throw new IllegalStateException("A user with username '" + userDTO.getUserName() + "' already exists.");
        }

        User user = new User();
        user.setFullName(userDTO.getFullName());
        user.setGender(userDTO.getGender());
        user.setUserName(userDTO.getUserName());
        user.setPassword(userDTO.getPassword());
        user.setStatus(userDTO.getStatus());
        user.setEnabled(userDTO.isEnabled());


        if (userDTO.getRoleIds() != null && !userDTO.getRoleIds().isEmpty()) {
            Set<UserRole> roles = userDTO.getRoleIds().stream()
                    .map(userRoleRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toSet());
            if (roles.size() != userDTO.getRoleIds().size()) {
                throw new EntityNotFoundException("One or more roles in the provided IDs not found");
            }

            user.setRoles(roles);
        }
        return userRepository.save(user);
    }


    public User getUserById(Long id) {
        return userRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new EntityNotFoundException("User with id " + id + " not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @Transactional
    public User updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new EntityNotFoundException("User with id " + id + " not found"));

        // Check if updating username and already exists
       /* if (!user.getUserName().equals(userDTO.getUserName()) && userRepository.findByUserName(userDTO.getUserName())) {
            throw new IllegalStateException("A user with username '" + userDTO.getUserName() + "' already exists.");
        }*/
        user.setFullName(userDTO.getFullName());
        user.setGender(userDTO.getGender());
        user.setUserName(userDTO.getUserName());
        user.setPassword(userDTO.getPassword());
        user.setStatus(userDTO.getStatus());
        user.setEnabled(userDTO.isEnabled());


        if (userDTO.getRoleIds() != null) {
            Set<UserRole> roles = userDTO.getRoleIds().stream()
                    .map(userRoleRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toSet());
            if(roles.size() != userDTO.getRoleIds().size()){
                throw new EntityNotFoundException("One or more roles in the provided IDs not found");
            }
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(Math.toIntExact(id))) {
            throw new EntityNotFoundException("User with id " + id + " not found");
        }
        userRepository.deleteById(Math.toIntExact(id));
    }
}