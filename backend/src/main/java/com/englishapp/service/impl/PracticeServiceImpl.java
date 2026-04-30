package com.englishapp.service.impl;

import com.englishapp.dto.question.PracticeQuestionResponse;
import com.englishapp.entity.PracticeQuestion;
import com.englishapp.entity.Topic;
import com.englishapp.exception.TopicNotFoundException;
import com.englishapp.repositoty.PracticeQuestionRepository;
import com.englishapp.repositoty.TopicRepository;
import com.englishapp.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticeServiceImpl implements PracticeService {

    private final PracticeQuestionRepository practiceQuestionRepository;
    private final TopicRepository topicRepository;
    @Override
    public List<PracticeQuestionResponse> getQuestionsByTopicId(Integer topicId) {

        if (!topicRepository.existsById(topicId)) {
            throw new TopicNotFoundException(topicId);
        }

        List<PracticeQuestion> questions =
                practiceQuestionRepository.findByTopic_TopicId(topicId);

        return questions.stream().map(q -> {
            PracticeQuestionResponse res = new PracticeQuestionResponse();
            res.setQuestionId(q.getQuestionId());
            res.setDescription(q.getDescription());
            return res;
        }).toList();
    }
}
