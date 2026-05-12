package com.englishapp.service;

import com.englishapp.entity.Feedback;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public interface GeminiAIService {
    Feedback evaluateAnswer(String question, String answer);

    default int extractScore(String text) {

        try {

            Pattern pattern = Pattern.compile("SCORE:\\s*(\\d+)");
            Matcher matcher = pattern.matcher(text);

            if (matcher.find()) {

                int score = Integer.parseInt(matcher.group(1));

                score = Math.max(0, Math.min(score, 100));

                return score;
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return 0;
    }
}
