package com.englishapp.dto.PracticeAnswer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerRequest {
    private Integer questionId;
    private String answer;
}