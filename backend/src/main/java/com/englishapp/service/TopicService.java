package com.englishapp.service;

import com.englishapp.dto.topic.TopicResponse;

import java.util.List;

public interface TopicService {

    List<TopicResponse> getAllTopics();
}
