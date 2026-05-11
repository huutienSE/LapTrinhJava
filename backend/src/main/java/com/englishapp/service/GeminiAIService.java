package com.englishapp.service;

import com.englishapp.entity.Feedback;

public interface GeminiAIService {

    Feedback evaluateAnswer(String question, String answer);
}