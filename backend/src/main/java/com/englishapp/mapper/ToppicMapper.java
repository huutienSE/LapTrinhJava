package com.englishapp.mapper;

import com.englishapp.dto.topic.TopicResponse;
import com.englishapp.entity.Topic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ToppicMapper
{
    TopicResponse topicToTopicResponse(Topic topic);
}
