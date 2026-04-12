package com.englishapp.service.impl;

import com.englishapp.dto.auth.RegisterRequest;
import com.englishapp.entity.Role;
import com.englishapp.entity.User;
import com.englishapp.entity.enums.RoleName;
import com.englishapp.entity.enums.UserStatus;
import com.englishapp.exception.EmailAlreadyExistsException;
import com.englishapp.repositoty.UserRepository;
import com.englishapp.service.AuthService;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor

public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepositoty roleRepositoty;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void register(RegisterRequest request) {
        validateEmail(request.getEmail());

        User user = mapToEntity(request);

        userRepository.save(user);
    }

    private void validateEmail(String email){
        // se tra ve mot exception neu email da ton tai
        if(userRepository.existsByEmail((email))){
            throw new EmailAlreadyExistsException(email);
        }
    }

    private User mapToEntity(RegisterRequest request){
        User newUser = new User();

        newUser.setUserName(request.getUserName());
        newUser.setEmail(request.getEmail());

        // endcode password
        newUser.setPasswordHash(passwordEncoder.endcode(request.getPassword()));

        // gan default role
        Role role = roleRepositoty.findByRoleName(RoleName.LEARNER)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        newUser.setRoles(Set.of(role));

        return newUser;
    }

}
