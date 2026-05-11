package com.englishapp.service.impl;

import com.englishapp.entity.Feedback;
import com.englishapp.service.GeminiAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiAIServiceImpl implements GeminiAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient.Builder webClientBuilder;

    @Override
    public Feedback evaluateAnswer(String question, String answer) {

        String prompt = """
                You are an English teacher.

                Evaluate the student's answer.

                Question:
                %s

                Student Answer:
                %s

                Return ONLY this format:

                SCORE: number
                FEEDBACK: text
                """.formatted(question, answer);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );

        String response = webClientBuilder.build()
                .post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header("X-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println(response);

        Feedback feedback = new Feedback();

        try {

            String text = response
                    .split("\"text\": \"")[1]
                    .split("\"")[0]
                    .replace("\\n", "\n");

            int score = extractScore(text);

            feedback.setOverallScore(score);
            feedback.setFeedbackText(text);

        } catch (Exception e) {

            feedback.setOverallScore(0);
            feedback.setFeedbackText("AI response parse error");
        }

        return feedback;
    }

    private int extractScore(String text) {

        try {

            String scoreLine = text.lines()
                    .filter(line -> line.startsWith("SCORE:"))
                    .findFirst()
                    .orElse("SCORE: 0");

            String scoreText = scoreLine
                    .replace("SCORE:", "")
                    .trim();

            if (scoreText.contains("/")) {
                scoreText = scoreText.split("/")[0];
            }

            return Integer.parseInt(scoreText);

        } catch (Exception e) {

            return 0;
        }
    }
}