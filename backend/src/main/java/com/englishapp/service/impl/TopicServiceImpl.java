package com.englishapp.service.impl;

import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.entity.Topic;
import com.englishapp.repositoty.TopicRepository;
import com.englishapp.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;

    @Override
    public List<TopicResponse> getAllTopics() {

        List<Topic>  topics = topicRepository.findAll();

        return topics.stream().map(topic -> {
            TopicResponse topicResponse = new TopicResponse();
            topicResponse.setTopicId(topic.getTopicId());
            topicResponse.setTopicName(topic.getTopicName());
            topicResponse.setDescription(topic.getDescription());
            topicResponse.setDifficultyLevel(topic.getDifficultyLevel().name());
            return topicResponse;
        }).toList();
    }
}
