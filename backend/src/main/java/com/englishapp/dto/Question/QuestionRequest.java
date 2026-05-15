package com.englishapp.dto.Question;

import com.englishapp.entity.enums.Level;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionRequest {

    @NotNull(message = "topicId is required")
    private Integer topicId;

    @NotBlank(message = "description is required")
    private String description;

    @NotNull(message = "difficultyLevel is required")
    private Level difficultyLevel;
}