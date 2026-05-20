package com.englishapp.dto.auth;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@JsonPropertyOrder({ "userId", "userName", "email" })
public class RegisterResponse {
    private Integer userId;

    private String userName;

    private String email;
}
