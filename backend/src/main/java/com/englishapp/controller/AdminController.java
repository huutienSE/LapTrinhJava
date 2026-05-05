package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.User.UserResponse;
import com.englishapp.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/user")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = adminService.getUsers();
        return new ApiResponse<>(true, users, "get users successfully");
    }
}
