package com.englishapp.service;

import com.englishapp.entity.Feedback;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public interface GeminiAIService {
    Feedback evaluateAnswer(String question, String answer);
}
