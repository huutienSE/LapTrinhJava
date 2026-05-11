package com.englishapp.mapper;

import com.englishapp.dto.question.QuestionRequest;
import com.englishapp.dto.question.QuestionResponse;
import com.englishapp.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    @Mapping(source = "topic.topicId", target = "topicId")
    @Mapping(source = "topic.topicName", target = "topicName")
    QuestionResponse toQuestionResponse(Question question);
    Question toQuestion(QuestionRequest questionRequest);
}
