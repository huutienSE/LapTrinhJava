package com.englishapp.dto.assessment;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AssessmentResponse {
    private Integer assessmentId;
    private Integer userId;
    private Integer score;
    private String levelAssigned;
    private LocalDateTime takenDate;
}
