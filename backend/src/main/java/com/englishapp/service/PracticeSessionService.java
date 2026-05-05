package com.englishapp.service;

import com.englishapp.dto.question.QuestionResponse;

import java.util.List;

public interface PracticeSessionService {
    List<QuestionResponse> getQuestionsByTopicId(Integer topicId);
}
