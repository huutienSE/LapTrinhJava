package com.englishapp.mapper;

import com.englishapp.dto.practice.PracticeQuestionResponse;
import com.englishapp.entity.Question;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PracticeMapper {
    PracticeQuestionResponse toPracticeQuestionResponse(Question question);

    List<PracticeQuestionResponse> toPracticeQuestionResponses(List<Question> questions);
}
