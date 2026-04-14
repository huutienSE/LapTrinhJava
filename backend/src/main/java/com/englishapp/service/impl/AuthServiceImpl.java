package com.englishapp.service.impl;

import com.englishapp.dto.auth.LoginRequest;
import com.englishapp.dto.auth.RegisterRequest;
import com.englishapp.entity.Role;
import com.englishapp.entity.User;
import com.englishapp.entity.UserRole;
import com.englishapp.entity.enums.RoleName;
import com.englishapp.entity.enums.UserStatus;
import com.englishapp.exception.EmailAlreadyExistsException;
import com.englishapp.exception.RoleNotFoundException;
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
    public void register(RegisterRequest request) {
        // check email ton tai
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException(request.getEmail());
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

        newUser.setEmail(request.getEmail().toLowerCase().trim());

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

    }

    @Override
    public void login(LoginRequest request) {
        // tim kiem user
        // check password
        // nếu sai
        // nếu đúng
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean isMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

        if(!isMatch){
            throw new RuntimeException("Invalid email or password");
        }
    }
}
