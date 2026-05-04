package com.englishapp.service;

import com.englishapp.dto.question.PracticeQuestionResponse;

import java.util.List;

public interface PracticeService {

    List<PracticeQuestionResponse> getQuestionsByTopicId(Integer topicId);
}
