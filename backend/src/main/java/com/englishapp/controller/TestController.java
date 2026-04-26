package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class TestController {

    @GetMapping("/me")
    public ApiResponse<Object> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Tạo object trả về gọn nhẹ để kiểm tra quyền
        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("principal_type", auth.getPrincipal().getClass().getSimpleName());
        debugInfo.put("authorities", auth.getAuthorities()); // Xem có đúng là [ROLE_LEARNER] không
        debugInfo.put("is_authenticated", auth.isAuthenticated());

        return new ApiResponse<>(true, debugInfo, "Check Security Context");
    }
}