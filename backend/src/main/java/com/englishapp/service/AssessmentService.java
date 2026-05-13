package com.englishapp.service;

import com.englishapp.dto.PracticeAnswer.AnswerRequest;
import com.englishapp.dto.assessment.AssessmentDetailResponse;
import com.englishapp.dto.assessment.AssessmentResponse;
import com.englishapp.dto.assessment.CommitAssessmentRequest;
import com.englishapp.dto.assessment.StartAssessmentResponse;
import com.englishapp.dto.assessment.ViewHistoryAssessmentResponse;
import com.englishapp.dto.question.PracticeQuestionDetailResponse;
import com.englishapp.entity.Assessment;

import java.util.List;

public interface AssessmentService {
    StartAssessmentResponse startAssessment(Integer userId);

    AssessmentResponse commitAssessment(CommitAssessmentRequest request, Integer userId);

    List<ViewHistoryAssessmentResponse> viewHistoryAssessmentResponses(Integer userId);

    AssessmentDetailResponse getAssessmentDetail(Integer assessmentId, Integer userId);

    PracticeQuestionDetailResponse AnswerQuestionAssessment(Integer userId, AnswerRequest request, Integer sessionId);

}