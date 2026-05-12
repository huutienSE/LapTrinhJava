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
public class GeminiAIServiceImpl implements GeminiAIService {

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
    public Feedback evaluateAnswer(String question, String answer) {

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
                FEEDBACK: short feedback
                """.formatted(question, answer);

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-flash-latest",
                        prompt,
                        null
                );

        String result = response.text();

//        System.out.println("========== GEMINI RESPONSE ==========");
//        System.out.println(result);

        int score = extractScore(result);

//        System.out.println("========== PARSED SCORE ==========");
//        System.out.println(score);

        Feedback feedback = new Feedback();

        feedback.setFeedbackText(result);
        feedback.setOverallScore(score);

        return feedback;
    }

}