package com.englishapp.dto.assessment;

import com.englishapp.dto.question.PracticeQuestionDetailResponse;
import com.englishapp.entity.enums.Level;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class AssessmentDetailResponse {
    private Integer assessmentId;
    private Integer score;
    private Level levelAssigned;
    private LocalDateTime takenDate;
    private List<PracticeQuestionDetailResponse> questions;
}
