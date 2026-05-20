package com.englishapp.service.impl;

import com.englishapp.entity.Feedback;
import com.englishapp.service.AIService;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class AIRouterServiceImpl implements AIService {
    private final GeminiFlashLastestServiceImpl geminiFlashLastestService;
    private final GeminiFlash31LiteServiceImpl geminiFlash31LiteService;
    private final GeminiFlash25ServiceImpl geminiFlash25Service;
    private final GeminiFlash25LiteServiceImpl geminiFlash25LiteService;

    public AIRouterServiceImpl(
            GeminiFlashLastestServiceImpl geminiFlashLastestService,
            GeminiFlash31LiteServiceImpl geminiFlash31Service,
            GeminiFlash25ServiceImpl geminiFlash25Service,
            GeminiFlash25LiteServiceImpl geminiFlash25LiteService
    ) {
        this.geminiFlashLastestService = geminiFlashLastestService;
        this.geminiFlash31LiteService = geminiFlash31Service;
        this.geminiFlash25Service = geminiFlash25Service;
        this.geminiFlash25LiteService = geminiFlash25LiteService;
    }

    @Override
    public Feedback evaluateAnswer(String question, String answer) {
        Exception lastException = null;

        try {
            return geminiFlashLastestService.evaluateAnswer(question, answer);
        } catch (Exception e) {
            lastException = e;
        }

        try {
            return geminiFlash31LiteService.evaluateAnswer(question, answer);
        } catch (Exception e) {
            lastException = e;
        }

        try {
            return geminiFlash25Service.evaluateAnswer(question, answer);
        } catch (Exception e) {
            lastException = e;
        }

        try {
            Feedback feedback = geminiFlash25LiteService.evaluateAnswer(question, answer);
            if (feedback != null && feedback.getFeedbackText() != null
                    && !"AI evaluation failed.".equals(feedback.getFeedbackText())) {
                return feedback;
            }
        } catch (Exception e) {
            lastException = e;
        }

        Feedback fallbackFeedback = new Feedback();
        fallbackFeedback.setOverallScore(0);
        fallbackFeedback.setFeedbackText("AI evaluation is temporarily unavailable. Please try again later.");

        if (lastException != null) {
            System.out.println("All AI providers failed: " + lastException.getMessage());
        }

        return fallbackFeedback;
    }
}