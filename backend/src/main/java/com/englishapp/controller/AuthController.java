package com.englishapp.controller;

import com.englishapp.dto.auth.LoginRequest;
import com.englishapp.dto.auth.RegisterRequest;
import com.englishapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request){
        authService.register(request);
        return "Register success";
    }

    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginRequest request){
        authService.login(request);
        return "Login success";
    }
}
