package com.englishapp.service;

import com.englishapp.entity.Question;

import java.util.List;

public interface QuestionService {
    List<Question> generateQuestionAssessment(Integer topicId);
}
