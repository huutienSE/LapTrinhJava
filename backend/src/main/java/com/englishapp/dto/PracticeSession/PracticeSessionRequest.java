package com.englishapp.dto.PracticeSession;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PracticeSessionRequest {
    private Integer sessionId;

    private Integer userId;

    private Integer topicId;

    private String sessionType;

    private Integer score;
}
