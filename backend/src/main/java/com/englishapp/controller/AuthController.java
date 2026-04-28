package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.auth.*;
import com.englishapp.security.UserPrincipal;
import com.englishapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

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

    @GetMapping("/test")
    public String test(){
        return "Hello JWT";
    }

    @GetMapping("/me")
    public ApiResponse<CurrentUserResponse> getCurrentUser(Authentication authentication) {

        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();

        CurrentUserResponse response = CurrentUserResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .roles(
                        user.getAuthorities()
                                .stream()
                                .map(a -> a.getAuthority())
                                .collect(Collectors.toList())
                )
                .build();

        return new ApiResponse<>(true, response, "Current user info"
        );
    }
}
