package com.englishapp.dto.practice;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PracticeQuestionDetailResponse {
    private Integer questionId;
    private String question;
    private String userAnswer;
    private String feedback;
    private Integer score;
}
