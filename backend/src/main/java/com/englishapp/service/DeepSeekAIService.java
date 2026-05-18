package com.englishapp.service;

import com.englishapp.entity.Feedback;

public interface DeepSeekAIService {

    Feedback evaluateAnswer(String question, String answer);
}