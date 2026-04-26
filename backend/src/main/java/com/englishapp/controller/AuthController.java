package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.auth.LoginRequest;
import com.englishapp.dto.auth.LoginResponse;
import com.englishapp.dto.auth.RegisterRequest;
import com.englishapp.dto.auth.RegisterResponse;
import com.englishapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/test")
    public String test(){
        return "Hello JWT";
    }

    @GetMapping("/me")
    public ApiResponse<Object> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return new ApiResponse<>(
                true,
                auth,
                "Current user info"
        );
    }
}
