package com.englishapp.controller;

import com.englishapp.common.ApiResponse;
import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService ;

    @GetMapping
    public ApiResponse<List<TopicResponse>> getAllTopics() {
        List<TopicResponse> topicResponse = topicService.getAllTopics();
        return new ApiResponse<>(true, topicResponse, "get AllTopics successfully");
    }
}
