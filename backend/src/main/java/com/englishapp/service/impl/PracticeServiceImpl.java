package com.englishapp.service.impl;

import com.englishapp.dto.PracticeHistory.PracticeHistoryResponse;
import com.englishapp.dto.PracticeSession.PracticeSessionRequest;
import com.englishapp.dto.question.PracticeQuestionResponse;
import com.englishapp.entity.PracticeQuestion;
import com.englishapp.entity.PracticeSession;
import com.englishapp.entity.Question;
import com.englishapp.entity.Topic;
import com.englishapp.exception.TopicNotFoundException;
import com.englishapp.exception.UserNotFound;
import com.englishapp.repositoty.*;
import com.englishapp.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticeServiceImpl implements PracticeService {

    private final PracticeQuestionRepository practiceQuestionRepository;
    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final PracticeSessionRepository practiceSessionRepository;
    private final UserRepository userRepository;
    @Override
    public List<PracticeQuestionResponse> getQuestionsByTopicId(Integer topicId) {

        if (!topicRepository.existsById(topicId)) {
            throw new TopicNotFoundException(topicId);
        }

        List<Question> questions =
                questionRepository.findByTopic_TopicId(topicId);

        return questions.stream().map(q -> {
            PracticeQuestionResponse res = new PracticeQuestionResponse();
            res.setQuestionId(q.getQuestionId());
            res.setDescription(q.getDescription());
            return res;
        }).toList();
    }

    @Override
    public List<PracticeHistoryResponse> getPracticeHistory(Integer userId) {

        if (!userRepository.existsById(userId)) {
            throw new UserNotFound(userId);
        }

        List<PracticeSession> sessions = practiceSessionRepository.findByUser_UserId(userId);

        return sessions.stream().map(session -> {
            PracticeHistoryResponse res = new PracticeHistoryResponse();
            res.setTopicName(session.getTopic().getTopicName());
            res.setScore(session.getScore());
            res.setTime(session.getEndedTime());
            res.setSessionId(session.getSessionId());
            return res;
        }).toList();

    }
}
