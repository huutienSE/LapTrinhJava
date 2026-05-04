package com.englishapp.service;

import com.englishapp.dto.User.UserResponse;

import java.util.List;


public interface UserService {
    public List<UserResponse> getUsers();
}
