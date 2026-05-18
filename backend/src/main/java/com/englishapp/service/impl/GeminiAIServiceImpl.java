package com.englishapp.service.impl;

import com.englishapp.entity.Feedback;
import com.englishapp.service.GeminiAIService;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeminiAIServiceImpl
        implements GeminiAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private Client client;

    @PostConstruct
    public void init() {

        client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    @Override
    public Feedback evaluateAnswer(
            String question,
            String answer
    ) {

        String prompt = """
                You are an IELTS speaking examiner.

                Question:
                %s

                User Answer:
                %s

                Evaluate the answer carefully.

                Score must be between 0 and 100.

                Return EXACTLY in this format:

                SCORE: number
                FEEDBACK: short feedback only
                """.formatted(question, answer);

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-flash-latest",
                        prompt,
                        null
                );

        String result = response.text();

        int score = extractScore(result);

        String feedbackText =
                extractFeedback(result);

        Feedback feedback =
                new Feedback();

        feedback.setOverallScore(score);

        feedback.setFeedbackText(
                feedbackText
        );

        return feedback;
    }

    private int extractScore(String text) {

        try {

            Pattern pattern =
                    Pattern.compile(
                            "SCORE:\\s*(\\d+)"
                    );

            Matcher matcher =
                    pattern.matcher(text);

            if (matcher.find()) {

                int score =
                        Integer.parseInt(
                                matcher.group(1)
                        );

                return Math.max(
                        0,
                        Math.min(score, 100)
                );
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return 0;
    }

    private String extractFeedback(
            String text
    ) {

        try {

            Pattern pattern =
                    Pattern.compile(
                            "FEEDBACK:\\s*(.*)",
                            Pattern.DOTALL
                    );

            Matcher matcher =
                    pattern.matcher(text);

            if (matcher.find()) {

                return matcher
                        .group(1)
                        .trim();
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return text;
    }
}