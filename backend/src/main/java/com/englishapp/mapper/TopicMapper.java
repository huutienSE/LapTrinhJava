package com.englishapp.mapper;

import com.englishapp.dto.topic.TopicRequest;
import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TopicMapper
{
    @Mapping(target = "difficultyLevel", source = "level")
    TopicResponse topicToTopicResponse(Topic topic);
    @Mapping(target = "level", source = "difficultyLevel")
    Topic topicRequestToTopic (TopicRequest topicRequest);
}
