package com.englishapp.service;

import com.englishapp.dto.PracticeHistory.PracticeHistoryResponse;
import com.englishapp.dto.question.PracticeQuestionDetailResponse;
import com.englishapp.dto.question.PracticeQuestionResponse;
import com.englishapp.dto.question.PracticeSessionDetailResponse;

import java.util.List;

public interface PracticeService {

    List<PracticeQuestionResponse> getQuestionsByTopicId(Integer topicId);

    List<PracticeHistoryResponse> getPracticeHistory();

    PracticeSessionDetailResponse getSessionDetail(Integer sessionId);
}
