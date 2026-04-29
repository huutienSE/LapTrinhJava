package com.englishapp.dto.profile;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProfileResponse {
    private Integer profileId;
    private Integer userId;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String level;
    private String targetGoal;
    private String occupation;
}