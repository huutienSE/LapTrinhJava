package com.englishapp.service.impl;

import com.englishapp.dto.practice.PracticeHistoryResponse;
import com.englishapp.dto.practice.PracticeQuestionDetailResponse;
import com.englishapp.dto.Question.QuestionResponse;
import com.englishapp.dto.practice.PracticeSessionDetailResponse;
import com.englishapp.dto.practice.PracticeHistoryResponse;
import com.englishapp.dto.practice.PracticeQuestionDetailResponse;
import com.englishapp.dto.practice.PracticeQuestionResponse;
import com.englishapp.dto.practice.PracticeSessionDetailResponse;
import com.englishapp.entity.*;
import com.englishapp.exception.ForbiddenException;
import com.englishapp.exception.SessionNotFoundException;
import com.englishapp.exception.TopicNotFoundException;
import com.englishapp.mapper.QuestionMapper;
import com.englishapp.repositoty.*;
import com.englishapp.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticeServiceImpl implements PracticeService {

    private final PracticeSessionRepository practiceSessionRepository;
    private final PracticeAnswerRepository practiceAnswerRepository;


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
}
