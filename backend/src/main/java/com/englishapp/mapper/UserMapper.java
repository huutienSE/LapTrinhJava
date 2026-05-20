package com.englishapp.mapper;

import com.englishapp.dto.user.UserResponse;
import com.englishapp.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "role", source = "")
    UserResponse userToUserResponse(User user);
}
