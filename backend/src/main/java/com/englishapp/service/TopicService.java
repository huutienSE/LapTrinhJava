package com.englishapp.service;

import com.englishapp.dto.topic.TopicRequest;
import com.englishapp.dto.topic.TopicResponse;

import java.util.List;

public interface TopicService {

    List<TopicResponse> getAllTopics();

    TopicResponse getTopicById(Integer topicId);

    TopicResponse createTopic(TopicRequest topicRequest);

    TopicResponse updateTopic(Integer topicId, TopicRequest topicRequest);

    void deleteTopic(Integer topicId);
}
