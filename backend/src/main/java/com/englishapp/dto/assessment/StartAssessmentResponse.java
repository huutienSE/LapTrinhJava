package com.englishapp.dto.assessment;

import com.englishapp.dto.question.PracticeQuestionResponse;
import com.englishapp.entity.Question;

import java.util.List;

public class StartAssessmentResponse {
    private Integer sessionId;
    private List<PracticeQuestionResponse> questions;
}
