package com.englishapp.dto.user;

import com.englishapp.entity.UserRole;
import com.englishapp.entity.enums.RoleName;
import com.englishapp.entity.enums.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponse {
    private Integer userId;
    private String userName;
    private String email;
    private UserStatus status;
    private LocalDateTime createdDate;
    private RoleName role;
}
