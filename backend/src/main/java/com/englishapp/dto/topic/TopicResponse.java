package com.englishapp.dto.topic;

import com.englishapp.entity.enums.Level;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopicResponse {
    private Integer topicId;
    private String topicName;
    private String description;
    private Level level;
}
