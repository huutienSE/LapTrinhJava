package com.englishapp.dto.profile;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String level;
    private String targetGoal;
    private String occupation;
}
