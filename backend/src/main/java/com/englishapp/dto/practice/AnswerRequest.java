package com.englishapp.dto.practice;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerRequest {
    private Integer questionId;
    private String answer;
}