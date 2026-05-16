package com.englishapp.dto.assessment;

import com.englishapp.dto.practice.PracticeQuestionResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StartAssessmentResponse {
    private Integer sessionId;
    private List<PracticeQuestionResponse> questions;
}