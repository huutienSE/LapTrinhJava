package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.User.UserResponse;
import com.englishapp.repositoty.RoleRepository;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getUsers();
        return new ApiResponse<>(true, users, "get users successfully");
    }
}
