package com.englishapp.service.impl;

import com.englishapp.dto.User.UserResponse;
import com.englishapp.entity.User;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
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
