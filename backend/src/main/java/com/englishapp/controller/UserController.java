package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.user.UserResponse;
import com.englishapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return new ApiResponse<> (
                true,
                userService.getAllUsers(),
                "get all users successfully"
        );
    }

    @GetMapping("/{email}")
    public ApiResponse<UserResponse> getUserByEmail(@PathVariable String email) {
        return new ApiResponse<> (
                true,
                userService.getUserByEmail(email),
                "get user by email successfully"
        );
    }

    @PatchMapping("/{userId}/status")
    public ApiResponse<UserResponse> updateUserStatus(@PathVariable Integer userId) {
        return new ApiResponse<> (
                true,
                userService.updateUserStatus(userId),
                "toggle user status successfully"
        );
    }
}
