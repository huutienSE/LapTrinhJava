package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.auth.CurrentUserResponse;
import com.englishapp.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class TestController {

    @GetMapping("/me")
//    public ApiResponse<Object> getCurrentUser() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//
//        // Tạo object trả về gọn nhẹ để kiểm tra quyền
//        Map<String, Object> debugInfo = new HashMap<>();
//        debugInfo.put("principal_type", auth.getPrincipal().getClass().getSimpleName());
//        debugInfo.put("authorities", auth.getAuthorities()); // Xem có đúng là [ROLE_LEARNER] không
//        debugInfo.put("is_authenticated", auth.isAuthenticated());
//
//        return new ApiResponse<>(true, debugInfo, "Check Security Context");
//    }
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