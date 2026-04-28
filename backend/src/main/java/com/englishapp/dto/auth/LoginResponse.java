package com.englishapp.dto.auth;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@JsonPropertyOrder({ "userId", "userName", "email", "token" })
public class LoginResponse {
    private Integer userId;
    private String userName;
    private String email;
    private String token;
}
