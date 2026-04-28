package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.auth.CurrentUserResponse;
import com.englishapp.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class TestController {

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