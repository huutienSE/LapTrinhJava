package com.englishapp.service.impl;

import com.englishapp.dto.practice.*;
import com.englishapp.dto.Question.QuestionResponse;
import com.englishapp.dto.practice.PracticeHistoryResponse;
import com.englishapp.dto.practice.PracticeQuestionDetailResponse;
import com.englishapp.dto.practice.PracticeSessionDetailResponse;
import com.englishapp.entity.*;
import com.englishapp.entity.enums.SessionType;
import com.englishapp.exception.*;
import com.englishapp.mapper.PracticeMapper;
import com.englishapp.mapper.QuestionMapper;
import com.englishapp.repositoty.*;
import com.englishapp.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticeServiceImpl implements PracticeService {

    private final PracticeQuestionRepository practiceQuestionRepository;

    private final TopicRepository topicRepository;

    private final QuestionRepository questionRepository;

    private final PracticeSessionRepository practiceSessionRepository;

    private final PracticeAnswerRepository practiceAnswerRepository;

    private final UserRepository userRepository;

    private final PracticeMapper practiceMapper;

    private final QuestionMapper questionMapper;

    @Override
    public List<QuestionResponse> getQuestionsByTopicId(Integer topicId) {

        if (!topicRepository.existsById(topicId)) {
            throw new TopicNotFoundException(topicId);
        }

        List<Question> questions =
                questionRepository.findByTopic_TopicId(topicId);

        return questions.stream().map(questionMapper::toQuestionResponse).toList();
    }

    @Override
    public List<PracticeHistoryResponse> getPracticeHistory(Integer userId) {

        List<PracticeSession> sessions = practiceSessionRepository.findByUserIdWithTopic(userId);

        return sessions.stream().map(session -> {
            PracticeHistoryResponse res = new PracticeHistoryResponse();
            res.setTopicName(session.getTopic().getTopicName());
            res.setScore(session.getScore());
            res.setTime(session.getEndedTime());
            res.setSessionId(session.getSessionId());
            return res;
        }).toList();

    }

    @Override
    public PracticeSessionDetailResponse getSessionDetail(Integer sessionId,
                                                          Integer userId) {

        PracticeSession session = practiceSessionRepository.findById(sessionId)
                .orElseThrow(SessionNotFoundException::new);

        if (!session.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        List<PracticeAnswer> answers = practiceAnswerRepository.findBySessionWithDetails(sessionId);

        List<PracticeQuestionDetailResponse> questions = answers.stream().map(answer -> {

            PracticeQuestionDetailResponse res = new PracticeQuestionDetailResponse();

            res.setQuestionId(answer.getPracticeQuestion().getQuestion().getQuestionId());

            res.setQuestion(answer.getPracticeQuestion().getQuestion().getDescription());

            res.setUserAnswer(answer.getUserAnswer());

            if (answer.getFeedback() != null) {
                res.setFeedback(answer.getFeedback().getFeedbackText());
                res.setScore(answer.getFeedback().getOverallScore());
            }

            return res;
        }).toList();

        PracticeSessionDetailResponse res = new PracticeSessionDetailResponse();
        res.setSessionId(session.getSessionId());
        res.setTopicName(session.getTopic().getTopicName());
        res.setScore(session.getScore());
        res.setQuestions(questions);

        return res;
    }

    @Transactional
    @Override
    public StartPracticeResponse startPractice(Integer topicId, Integer userId) {

        Topic topic = topicRepository.findById(topicId).orElseThrow(() -> new TopicNotFoundException(topicId));

        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

        List<Question> questions = questionRepository.findByTopic_TopicId(topicId);

        if(questions.isEmpty()){
            throw new QuestionNotFoundException();
        }


        PracticeSession session = new PracticeSession();

        session.setUser(user);

        session.setTopic(topic);

        session.setSessionType(SessionType.PRACTICE);

        session.setStartedTime(LocalDateTime.now());

        PracticeSession savedSession = practiceSessionRepository.save(session); // luu session truoc de lay sessionId

        // lay question
        List<PracticeQuestion> practiceQuestions = questions.stream()
                                                .map(question -> new PracticeQuestion(savedSession, question))
                                                .toList();

        practiceQuestionRepository.saveAll(practiceQuestions); // save mapping

        // chuyen sang list question response
        List<PracticeQuestionResponse> questionResponses = practiceMapper.toPracticeQuestionResponses(questions);

        // tra ve response
        StartPracticeResponse response = new StartPracticeResponse();
        response.setSessionId(savedSession.getSessionId());
        response.setTopicName(topic.getTopicName());
        response.setQuestions(questionResponses);

        return response;
    }


}
