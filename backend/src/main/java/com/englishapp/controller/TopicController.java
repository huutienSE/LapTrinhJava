package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.question.QuestionResponse;
import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.service.PracticeSessionService;
import com.englishapp.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService ;
    private final PracticeSessionService practiceSessionServiceService;

    @GetMapping
    public ApiResponse<List<TopicResponse>> getAllTopics() {
        List<TopicResponse> topicResponse = topicService.getAllTopics();
        return new ApiResponse<>(true, topicResponse, "get AllTopics successfully");
    }

    @GetMapping("/{topicId}/questions")
    public ApiResponse<List<QuestionResponse>> getQuestions(@PathVariable Integer topicId) {
        List<QuestionResponse> practiceQuestionResponses =  practiceSessionServiceService.getQuestionsByTopicId(topicId);
        return new ApiResponse<>(true, practiceQuestionResponses, "get Questions successfully");
    }
}
