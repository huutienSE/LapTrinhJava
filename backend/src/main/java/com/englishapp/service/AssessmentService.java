package com.englishapp.service;

import com.englishapp.dto.assessment.AssessmentResponse;
import com.englishapp.dto.assessment.CommitAssessmentRequest;
import com.englishapp.dto.assessment.StartAssessmentRequest;
import com.englishapp.entity.Assessment;

public interface AssessmentService {
    Integer startAssessment(StartAssessmentRequest startAssessmentRequest);

    AssessmentResponse commitAssessment(CommitAssessmentRequest request);

    AssessmentResponse mapToAssessmentResponse(Assessment assessment);
}
