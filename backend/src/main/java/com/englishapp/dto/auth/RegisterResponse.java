package com.englishapp.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class RegisterResponse {
    private String userId;

    private String email;

    private String message;
}
