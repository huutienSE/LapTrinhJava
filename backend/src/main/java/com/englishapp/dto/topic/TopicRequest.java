package com.englishapp.dto.topic;

import com.englishapp.entity.enums.Level;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopicRequest {
    @NotBlank(message = "topic name must be required")
    private String topicName;
    private String description;
    private Level difficultyLevel;
}
