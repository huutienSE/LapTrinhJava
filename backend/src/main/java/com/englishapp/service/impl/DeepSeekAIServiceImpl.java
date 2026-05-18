package com.englishapp.service.impl;

import com.englishapp.entity.Feedback;
import com.englishapp.service.DeepSeekAIService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DeepSeekAIServiceImpl implements DeepSeekAIService {

    @Value("${deepseek.api.key}")
    private String apiKey;
    private OpenAIClient client;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        client = OpenAIOkHttpClient.builder()
                .apiKey(apiKey)
                .baseUrl("https://api.deepseek.com")
                .build();
    }

    @Override
    public Feedback evaluateAnswer(String question, String answer) {
        try {

            String prompt = """
                    You are an IELTS speaking examiner.
                    
                    Question:
                    %s
                    
                    User Answer:
                    %s
                    
                    Return ONLY valid JSON.
                    
                    Example:
                    {
                      "score": 75,
                      "feedback": "Good fluency but grammar can be improved."
                    }
                    """.formatted(question, answer);

            ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                            .model("deepseek-chat")
                            .addUserMessage(prompt)
                            .build();

            ChatCompletion response = client.chat()
                            .completions()
                            .create(params);

            String result = response.choices().get(0).message().content().orElse("{}");

            JsonNode jsonNode = objectMapper.readTree(result);

            int score = jsonNode.get("score").asInt();

            String feedbackText = jsonNode.get("feedback").asText();

            Feedback feedback = new Feedback();
            feedback.setOverallScore(score);
            feedback.setFeedbackText(feedbackText);

            return feedback;

        } catch (Exception e) {
            e.printStackTrace();
            Feedback feedback = new Feedback();
            feedback.setOverallScore(0);

            feedback.setFeedbackText("AI evaluation failed.");
            return feedback;
        }
    }
}