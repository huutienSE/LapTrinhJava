package com.englishapp.dto.question;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PracticeSessionDetailResponse {
    private Integer sessionId;
    private String topicName;
    private Integer score;
    private List<PracticeQuestionDetailResponse> questions;
}
