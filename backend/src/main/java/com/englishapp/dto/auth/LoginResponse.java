package com.englishapp.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private Integer userId;
    private String userName;
    private String email;
    private String token;
}
