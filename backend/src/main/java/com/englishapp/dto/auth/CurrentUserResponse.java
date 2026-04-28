package com.englishapp.dto.auth;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CurrentUserResponse {

    private Integer userId;
    private String email;
    private List<String> roles;
}