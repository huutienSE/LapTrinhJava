package com.englishapp.dto.assessment;

import com.englishapp.dto.practice.AnswerRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CommitAssessmentRequest {
    private Integer sessionId;
    private List<AnswerRequest> answers;
}
