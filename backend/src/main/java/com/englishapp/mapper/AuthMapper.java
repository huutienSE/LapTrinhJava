package com.englishapp.mapper;

import com.englishapp.dto.auth.LoginResponse;
import com.englishapp.dto.auth.RegisterResponse;
import com.englishapp.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    RegisterResponse toRegisterResponse(User user);

    LoginResponse toLoginResponse(User user);
}
