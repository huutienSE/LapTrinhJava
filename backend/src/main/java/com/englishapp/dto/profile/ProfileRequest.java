package com.englishapp.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProfileRequest {

    @NotNull(message = "UserId is required")
    private Integer userId;

    @NotBlank(message = "Full name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Birth date is required")
    private LocalDate birthDate;

    @NotBlank(message = "Level is required")
    private String level;

    @NotBlank(message = "Target goal is required")
    private String targetGoal;

    @NotBlank(message = "Occupation is required")
    private String occupation;
}