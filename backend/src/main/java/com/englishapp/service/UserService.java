package com.englishapp.service;


import com.englishapp.dto.user.UserResponse;

import java.util.List;

public interface UserService {

    public List<UserResponse> getAllUsers();

    public UserResponse getUserByEmail(String email);

    public UserResponse updateUserStatus(Integer userId);
}
