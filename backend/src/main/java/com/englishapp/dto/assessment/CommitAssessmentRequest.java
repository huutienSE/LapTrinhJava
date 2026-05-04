package com.englishapp.dto.assessment;

import com.englishapp.dto.PracticeAnswer.AnswerRequest;
import jakarta.persistence.GeneratedValue;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Getter
@Setter
public class CommitAssessmentRequest {
    private Integer sessionId;
    private List<AnswerRequest> answers;
}
