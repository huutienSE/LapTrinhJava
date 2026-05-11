package com.englishapp.service;

import com.englishapp.dto.question.QuestionRequest;
import com.englishapp.dto.question.QuestionResponse;
import com.englishapp.entity.Question;

import java.util.List;

public interface QuestionService {
    List<Question> generateQuestionAssessment(Integer topicId);
    List<QuestionResponse> getAllQuestions();
    QuestionResponse getQuestionById(Integer topicId);
    void deleteQuestionById(Integer topicId);
    QuestionResponse createQuestion(QuestionRequest question);
    QuestionResponse updateQuestion(QuestionRequest question, Integer questionId);
}
