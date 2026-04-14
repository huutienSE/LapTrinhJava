package com.englishapp.service;

import com.englishapp.dto.auth.LoginRequest;
import com.englishapp.dto.auth.LoginResponse;
import com.englishapp.dto.auth.RegisterRequest;
import com.englishapp.dto.auth.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
