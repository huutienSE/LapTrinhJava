package com.englishapp.service.impl;

import com.englishapp.dto.auth.LoginRequest;
import com.englishapp.dto.auth.LoginResponse;
import com.englishapp.dto.auth.RegisterRequest;
import com.englishapp.dto.auth.RegisterResponse;
import com.englishapp.entity.Role;
import com.englishapp.entity.User;
import com.englishapp.entity.UserRole;
import com.englishapp.entity.enums.RoleName;
import com.englishapp.entity.enums.UserStatus;
import com.englishapp.exception.EmailAlreadyExistsException;
import com.englishapp.exception.InvalidCredentialsException;
import com.englishapp.exception.RoleNotFoundException;
import com.englishapp.exception.UserDisabledException;
import com.englishapp.repositoty.RoleRepository;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.repositoty.UserRoleRepository;
import com.englishapp.service.AuthService;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository; // injection

    private final PasswordEncoder passwordEncoder;

    private final RoleRepository roleRepository;

    private final UserRoleRepository userRoleRepository;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        String email = normalizeEmail(request.getEmail());

        validateEmailNotExists(email);

        User user = createUser(request, email);

        Role role = getDefaultRole();

        saveUserRole(user, role);

        return mapToRegisterResponse(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        String email = normalizeEmail(request.getEmail());

        User user = getUserByEmail(email);

        validateUserActive(user);

        validatePassword(request.getPassword(), user.getPasswordHash());

        return mapToLoginResponse(user);
    }

    // Register method

    private String normalizeEmail(String email) {
        return email == null ? null : email.toLowerCase().trim();
    }

    private void validateEmailNotExists(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email);
        }
    }

    private User createUser(RegisterRequest request, String email) {

        User user = new User();

        user.setUserName(request.getUserName());

        user.setEmail(email);

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        user.setStatus(UserStatus.ACTIVE);

        user.setCreatedDate(LocalDateTime.now());

        return userRepository.save(user);
    }

    private Role getDefaultRole() {
        return roleRepository.findByRoleName(RoleName.LEARNER).orElseThrow(RoleNotFoundException::new);
    }

    private void saveUserRole(User user, Role role) {
        UserRole userRole = new UserRole(user, role);
        userRoleRepository.save(userRole);
    }

    private RegisterResponse mapToRegisterResponse(User user) {

        RegisterResponse response = new RegisterResponse();

        response.setUserId(user.getUserId());

        response.setUserName(user.getUserName());

        response.setEmail(user.getEmail());

        return response;
    }


    // Login method

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(InvalidCredentialsException::new);
    }

    private void validateUserActive(User user) {
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UserDisabledException();
        }
    }

    private void validatePassword(String rawPassword, String encodedPassword) {
        if (!passwordEncoder.matches(rawPassword, encodedPassword)) {
            throw new InvalidCredentialsException();
        }
    }

    private LoginResponse mapToLoginResponse(User user) {

        LoginResponse response = new LoginResponse();

        response.setUserId(user.getUserId());

        response.setUserName(user.getUserName());

        response.setEmail(user.getEmail());

        return response;
    }
}

