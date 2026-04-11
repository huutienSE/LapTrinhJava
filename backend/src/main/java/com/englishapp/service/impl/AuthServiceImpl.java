package com.englishapp.service.impl;

import com.englishapp.dto.auth.RegisterRequest;
import com.englishapp.entity.User;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.service.AuthService;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void register(RegisterRequest request) {
        // kiem tra email ton tai
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email Already exists");
        }

        User user = new User();
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());

        // tao moi user

        //save DB
    }
}
