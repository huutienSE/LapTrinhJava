package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.practice.PracticeQuestionResponse;
import com.englishapp.dto.Question.QuestionResponse;
import com.englishapp.dto.topic.TopicRequest;
import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.service.PracticeService;
import com.englishapp.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;
    private final PracticeService practiceService;

    @GetMapping
    public ApiResponse<List<TopicResponse>> getAllTopics() {
        List<TopicResponse> topicResponse = topicService.getAllTopics();
        return new ApiResponse<>(true, topicResponse, "get AllTopics successfully");
    }

    // lấy question
    @GetMapping("/{topicId}/questions")
    public ApiResponse<List<QuestionResponse>> getQuestions(@PathVariable Integer topicId) {
        List<QuestionResponse> practiceQuestionResponses =  practiceService.getQuestionsByTopicId(topicId);
        return new ApiResponse<>(true, practiceQuestionResponses, "get Questions successfully");
    }

    @GetMapping("/{topicId}")
    public ApiResponse<TopicResponse> getTopicById(@PathVariable Integer topicId) {
        return new ApiResponse<>(true, topicService.getTopicById(topicId), "get Topic successfully");
    }

    @GetMapping("/search")
    public ApiResponse<TopicResponse> getTopicByTopicName(@RequestParam String topicName) {
        return new ApiResponse<>(true, topicService.getTopicByTopicName(topicName), "get Topic successfully");
    }

    @PostMapping
    public ApiResponse<TopicResponse> createTopic(@Valid @RequestBody TopicRequest topicRequest) {
        return new ApiResponse<>(true, topicService.createTopic(topicRequest), "create Topic successfully");
    }

    @PutMapping("/{topicId}")
    public ApiResponse<TopicResponse> updateTopic(@PathVariable Integer topicId, @Valid @RequestBody TopicRequest topicRequest) {
        return new ApiResponse<>(true, topicService.updateTopic(topicId, topicRequest), "update Topic successfully");
    }

    @DeleteMapping("/{topicId}")
    public ApiResponse<Void> deleteTopic(@PathVariable Integer topicId) {
        topicService.deleteTopic(topicId);

        return new ApiResponse<>(
                true,
                null,
                "delete Topic successfully"
        );
    }


}
