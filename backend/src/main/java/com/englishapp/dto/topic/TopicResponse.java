package com.englishapp.dto.topic;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopicResponse {
    private Integer topicId;
    private String topicName;
    private String description;
    private String difficultyLevel;
}
