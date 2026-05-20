package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.practice.PracticeQuestionResponse;
import com.englishapp.dto.Question.QuestionResponse;
import com.englishapp.dto.topic.TopicRequest;
import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.service.PracticeService;
import com.englishapp.service.QuestionService;
import com.englishapp.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;
    private final QuestionService questionService;

    // lấy question
    @GetMapping("/topics/{topicId}/questions")
    public ApiResponse<List<QuestionResponse>> getQuestions(@PathVariable Integer topicId) {
        List<QuestionResponse> practiceQuestionResponses =  questionService.getQuestionsByTopicId(topicId);
        return new ApiResponse<>(true, practiceQuestionResponses, "get Questions successfully");
    }

    @GetMapping("/topics")
    public ApiResponse<List<TopicResponse>> getAllTopics() {
        List<TopicResponse> topicResponse = topicService.getAllTopics();
        return new ApiResponse<>(true, topicResponse, "get AllTopics successfully");
    }

    @GetMapping("/topics/{topicId}")
    public ApiResponse<TopicResponse> getTopicById(@PathVariable Integer topicId) {
        return new ApiResponse<>(true, topicService.getTopicById(topicId), "get Topic successfully");
    }

    //------------

    @GetMapping("/admin/topics/search")
    public ApiResponse<TopicResponse> getTopicByTopicName(@RequestParam String topicName) {
        return new ApiResponse<>(true, topicService.getTopicByTopicName(topicName), "get Topic successfully");
    }

    @PostMapping("/admin/topics")
    public ApiResponse<TopicResponse> createTopic(@Valid @RequestBody TopicRequest topicRequest) {
        return new ApiResponse<>(true, topicService.createTopic(topicRequest), "create Topic successfully");
    }

    @PutMapping("/admin/topics/{topicId}")
    public ApiResponse<TopicResponse> updateTopic(@PathVariable Integer topicId, @Valid @RequestBody TopicRequest topicRequest) {
        return new ApiResponse<>(true, topicService.updateTopic(topicId, topicRequest), "update Topic successfully");
    }

    @DeleteMapping("/admin/topics/{topicId}")
    public ApiResponse<Void> deleteTopic(@PathVariable Integer topicId) {
        topicService.deleteTopic(topicId);

        return new ApiResponse<>(
                true,
                null,
                "delete Topic successfully"
        );
    }


}
