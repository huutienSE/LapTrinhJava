package com.englishapp.service;

import com.englishapp.dto.auth.LoginRequest;
import com.englishapp.dto.auth.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);

    void login(LoginRequest request);
}
