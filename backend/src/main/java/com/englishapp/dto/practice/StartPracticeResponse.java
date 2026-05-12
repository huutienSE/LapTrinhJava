package com.englishapp.dto.practice;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StartPracticeResponse {

    private Integer sessionId;

    private String topicName;

    private List<PracticeQuestionResponse> questions;
}