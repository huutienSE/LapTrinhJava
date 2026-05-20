package com.englishapp.service.impl;

import com.englishapp.dto.topic.TopicRequest;
import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.entity.Topic;
import com.englishapp.exception.TopicAlreadyExistsException;
import com.englishapp.exception.TopicNotFoundException;
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

        return topics.stream().map(topicMapper::topicToTopicResponse).toList();
    }
    @Override
    public TopicResponse getTopicById(Integer topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException(topicId));

        return topicMapper.topicToTopicResponse(topic);
    }

    @Override
    public TopicResponse getTopicByTopicName(String topicName) {
        Topic topic = topicRepository.findByTopicName(topicName);
        if (topic == null) {
            return null;
        }
        return topicMapper.topicToTopicResponse(topic);
    }

    @Override
    public TopicResponse createTopic(TopicRequest topicRequest) {

        if (topicRepository.findByTopicName(topicRequest.getTopicName()) != null) {
            throw new TopicAlreadyExistsException(topicRequest.getTopicName());
        }

        Topic topic = topicMapper.topicRequestToTopic(topicRequest);
        topicRepository.save(topic);

        return  topicMapper.topicToTopicResponse(topic);
    }
    @Override
    public TopicResponse updateTopic(Integer topicId, TopicRequest topicRequest) {
        Topic topic = topicMapper.topicRequestToTopic(topicRequest);
        topicRepository.save(topic);
        return  topicMapper.topicToTopicResponse(topic);
    }

    @Override
    public void deleteTopic(Integer topicId) {
        Topic  topic = topicRepository.findById(topicId)
                .orElseThrow(()-> new TopicNotFoundException(topicId));

        topicRepository.delete(topic);
    }
}
