package com.englishapp.service.impl;

import com.englishapp.dto.question.QuestionResponse;
import com.englishapp.entity.Question;
import com.englishapp.exception.TopicNotFoundException;
import com.englishapp.repositoty.PracticeQuestionRepository;
import com.englishapp.repositoty.QuestionRepository;
import com.englishapp.repositoty.TopicRepository;
import com.englishapp.service.PracticeSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticeSessionServiceImpl implements PracticeSessionService {

    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;

    @Override
    public List<QuestionResponse> getQuestionsByTopicId(Integer topicId) {

        if (!topicRepository.existsById(topicId)) {
            throw new TopicNotFoundException(topicId);
        }

        List<Question> questions =
                questionRepository.findByTopic_TopicId(topicId);

        return questions.stream().map(q -> {
            QuestionResponse res = new QuestionResponse();
            res.setQuestionId(q.getQuestionId());
            res.setDescription(q.getDescription());
            return res;
        }).toList();
    }
}
