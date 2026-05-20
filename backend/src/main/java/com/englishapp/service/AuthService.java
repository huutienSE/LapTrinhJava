package com.englishapp.service;

import com.englishapp.dto.auth.*;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
