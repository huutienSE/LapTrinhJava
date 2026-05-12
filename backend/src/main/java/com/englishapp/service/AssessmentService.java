package com.englishapp.service;

import com.englishapp.dto.assessment.AssessmentDetailResponse;
import com.englishapp.dto.assessment.AssessmentResponse;
import com.englishapp.dto.assessment.CommitAssessmentRequest;
import com.englishapp.dto.assessment.ViewHistoryAssessmentResponse;
import com.englishapp.entity.Assessment;

import java.util.List;

public interface AssessmentService {
    Integer startAssessment(Integer userId);

    AssessmentResponse commitAssessment(CommitAssessmentRequest request, Integer userId);

    List<ViewHistoryAssessmentResponse> viewHistoryAssessmentResponses(Integer userId);

    AssessmentDetailResponse getAssessmentDetail(Integer assessmentId, Integer userId);

}
