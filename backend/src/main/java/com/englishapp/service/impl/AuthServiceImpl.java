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
        // check email ton tai

        String email = request.getEmail().toLowerCase().trim();
        if(userRepository.existsByEmail(email)){
            throw new EmailAlreadyExistsException(email);
        }
        // tao moi user
        // enccode password
        // save db
        // lấy role
        // map user --> role
        // tao moi UserRole , save DB
        //
        User newUser = new User();

        newUser.setUserName(request.getUserName());

        newUser.setEmail(email);

        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword())); // injection PasswordEndcoder

        newUser.setStatus(UserStatus.ACTIVE);

        newUser.setCreatedDate(LocalDateTime.now());

        userRepository.save(newUser);

        // get reol user
        // injection

        Role role = roleRepository.findByRoleName(RoleName.LEARNER)
                .orElseThrow(RoleNotFoundException::new);  // method reference, java 8 lambda

        // UserRole
        UserRole userRole = new UserRole(newUser, role);

//        userRole.setUser(newUser);
//
//        userRole.setRole(role);

        userRoleRepository.save(userRole);

        RegisterResponse response = new RegisterResponse();
        response.setUserId(newUser.getUserId());
        response.setUserName(newUser.getUserName());
        response.setEmail(newUser.getEmail());

        return response;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // tim kiem user
        // check password
        // nếu sai
        // nếu đúng

        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if(user.getStatus() != UserStatus.ACTIVE){
            throw new UserDisabledException();
        }

        boolean isMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

        if(!isMatch){
            throw new InvalidCredentialsException();
        }

        LoginResponse response = new LoginResponse();
        response.setUserId(user.getUserId());
        response.setUserName(user.getUserName());
        response.setEmail(user.getEmail());

        return response;
    }
}
