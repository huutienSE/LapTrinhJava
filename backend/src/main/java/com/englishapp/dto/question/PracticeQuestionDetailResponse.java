package com.englishapp.dto.question;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PracticeQuestionDetailResponse {
    private Integer questionId;
    private String question;
    private String answer;
    private String feedback;
    private Integer Score;
}
