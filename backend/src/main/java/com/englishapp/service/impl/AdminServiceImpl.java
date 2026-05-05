package com.englishapp.service.impl;

import com.englishapp.dto.User.UserResponse;
import com.englishapp.entity.User;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserResponse userResponse = MaptoUserResponse(user);
            return userResponse;
        }).toList();
    }

    public UserResponse MaptoUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setUserName(user.getUserName());
        userResponse.setEmail(user.getEmail());
        userResponse.setUserId(user.getUserId());
        return userResponse;
    }
}
