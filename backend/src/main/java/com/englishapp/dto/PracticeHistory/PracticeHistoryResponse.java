package com.englishapp.dto.PracticeHistory;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PracticeHistoryResponse {

    private String topicName;
    private Integer score;
    private LocalDateTime time;
    private Integer sessionId;
}
