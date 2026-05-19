package com.englishapp.dto.practice;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommitPracticeResponse {
    private Integer sessionId;

    private Integer score;

    private Integer totalQuestions;

    private Integer answeredQuestions;
}
