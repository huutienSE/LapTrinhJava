package com.englishapp.service;

import com.englishapp.dto.practice.PracticeHistoryResponse;
import com.englishapp.dto.practice.StartPracticeResponse;
import com.englishapp.dto.practice.PracticeQuestionResponse;
import com.englishapp.dto.practice.PracticeSessionDetailResponse;
import com.englishapp.dto.practice.PracticeHistoryResponse;
import com.englishapp.dto.Question.QuestionResponse;
import com.englishapp.dto.practice.PracticeSessionDetailResponse;

import java.util.List;

public interface PracticeService {

    List<QuestionResponse> getQuestionsByTopicId(Integer topicId);

    List<PracticeHistoryResponse> getPracticeHistory(Integer userId);

    PracticeSessionDetailResponse getSessionDetail(Integer sessionId,
                                                   Integer userId);

//    // huutienSE25
//    StartPracticeResponse startPractice(Integer topicId, Integer userId);
}
