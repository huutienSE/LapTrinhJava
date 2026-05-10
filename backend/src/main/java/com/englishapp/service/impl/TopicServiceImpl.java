package com.englishapp.service.impl;

import com.englishapp.dto.topic.TopicRequest;
import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.entity.Topic;
import com.englishapp.mapper.TopicMapper;
import com.englishapp.repositoty.TopicRepository;
import com.englishapp.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    @Override
    public List<TopicResponse> getAllTopics() {

        List<Topic>  topics = topicRepository.findAll();

        return topics.stream().map(topic -> {
            TopicResponse topicResponse = new TopicResponse();
            topicResponse.setTopicId(topic.getTopicId());
            topicResponse.setTopicName(topic.getTopicName());
            topicResponse.setDescription(topic.getDescription());
            topicResponse.setLevel(topic.getLevel());
            return topicResponse;
        }).toList();
    }
    @Override
    public TopicResponse getTopicById(Integer topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(null);

        return topicMapper.topicToTopicResponse(topic);
    }
    @Override
    public TopicResponse createTopic(TopicRequest topicRequest) {
        if (topicRepository.existsByTopicName(topicRequest.getTopicName())) {
            throw new RuntimeException();
        }

        Topic topic = new Topic();
        topic.setTopicName(topicRequest.getTopicName());
        topic.setDescription(topicRequest.getDescription());
        topic.setLevel(topicRequest.getLevel());
        Topic savedTopic = topicRepository.save(topic);
        return  topicMapper.topicToTopicResponse(savedTopic);
    }
    @Override
    public TopicResponse updateTopic(Integer topicId, TopicRequest topicRequest) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(null);

        topic.setTopicName(topicRequest.getTopicName());
        topic.setDescription(topicRequest.getDescription());
        topic.setLevel(topicRequest.getLevel());
        Topic savedTopic = topicRepository.save(topic);
        return  topicMapper.topicToTopicResponse(savedTopic);
    }

    @Override
    public void deleteTopic(Integer topicId) {
        Topic  topic = topicRepository.findById(topicId)
                .orElseThrow(null);

        topicRepository.delete(topic);
    }
}
