package com.englishapp.controller;

import com.englishapp.dto.auth.LoginRequest;
import com.englishapp.dto.auth.LoginResponse;
import com.englishapp.dto.auth.RegisterRequest;
import com.englishapp.dto.auth.RegisterResponse;
import com.englishapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request){
        RegisterResponse response = authService.register(request);
        return new ApiResponse<>(true, response, "Register success");
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = authService.login(request);
        return new ApiResponse<>(true, response, "Login success");
    }

}
