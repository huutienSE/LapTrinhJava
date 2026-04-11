package com.englishapp.service;

import com.englishapp.dto.auth.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
}
