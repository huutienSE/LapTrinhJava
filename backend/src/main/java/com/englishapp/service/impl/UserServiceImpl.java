package com.englishapp.service.impl;

import com.englishapp.dto.user.UserResponse;
import com.englishapp.entity.User;
import com.englishapp.entity.enums.RoleName;
import com.englishapp.entity.enums.UserStatus;
import com.englishapp.mapper.UserMapper;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

     public List<UserResponse> getAllUsers() {
         List<User> users = userRepository.findAll();
         return users.stream().map(user -> {
            UserResponse userResponse = userMapper.userToUserResponse(user);
            userResponse.setRole(user.getUserRoles().getFirst().getRole().getRoleName());
            return  userResponse;
         }).toList();
     }

    @Override
    public UserResponse getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()){
            return null;
        }
        User finalUser = user.get();
        UserResponse userResponse = userMapper.userToUserResponse(finalUser);
        userResponse.setRole(finalUser.getUserRoles().getFirst().getRole().getRoleName());
        return userResponse;
    }

    @Override
    public UserResponse updateUserStatus(Integer userId) {

         User user = userRepository.findById(userId)
                 .orElseThrow(()-> new RuntimeException("UserId not found!"));

         if (user.getStatus() == UserStatus.ACTIVE) {
             user.setStatus(UserStatus.DISABLE);
         } else {
             user.setStatus(UserStatus.ACTIVE);
         }
         UserResponse userSaved = userMapper.userToUserResponse(userRepository.save(user));
         userSaved.setRole(user.getUserRoles().getFirst().getRole().getRoleName());
         return userSaved;
    }


}
