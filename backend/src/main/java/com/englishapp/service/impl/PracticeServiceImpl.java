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
import com.englishapp.service.AIService;
import com.englishapp.service.GeminiAIService;
import com.englishapp.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
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

    private final FeedbackRepository feedbackRepository;

    private final GeminiAIService geminiAIService;

    private final AIService aiService;


    @Override
    public List<PracticeHistoryResponse> getPracticeHistory(Integer userId) {

        List<PracticeSession> sessions = practiceSessionRepository.findByUser_UserIdAndSessionTypeAndEndedTimeIsNotNullOrderByEndedTimeDesc(userId, SessionType.PRACTICE);

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

        List<Question> questions = new ArrayList<>();

        questions.addAll(questionRepository.findRandomByLevel(topicId, "BEGINNER", 4));

        questions.addAll(questionRepository.findRandomByLevel(topicId, "INTERMEDIATE", 3));

        questions.addAll(questionRepository.findRandomByLevel(topicId, "ADVANCED", 3));

        questions.sort(Comparator.comparing(q -> q.getDifficultyLevel().ordinal()));

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

    @Override
    @Transactional
    public PracticeQuestionDetailResponse answerQuestion(Integer userId, Integer sessionId, AnswerRequest request) {

        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

        PracticeSession session = practiceSessionRepository.findById(sessionId).orElseThrow(SessionNotFoundException::new);

        if (!session.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        if (session.getEndedTime() != null) {
            throw new AssessmentAlreadyCommittedException();
        }

        // tìm question trong session
        PracticeQuestion practiceQuestion = practiceQuestionRepository.findById(new PracticeQuestionId(sessionId, request.getQuestionId())).orElseThrow(QuestionNotFoundException::new);

        boolean alreadyAnswered = practiceAnswerRepository.existsByPracticeQuestion_Id(practiceQuestion.getId());

        if (alreadyAnswered) {
            throw new QuestionAlreadyAnsweredException();
        }

        Feedback feedback;

        feedback = aiService.evaluateAnswer(
                practiceQuestion.getQuestion().getDescription(),
                request.getAnswer());


        PracticeAnswer answer = new PracticeAnswer();

        answer.setPracticeQuestion(practiceQuestion);

        answer.setUserAnswer(request.getAnswer());

        answer.setCreatedDate(LocalDateTime.now());

        PracticeAnswer savedAnswer = practiceAnswerRepository.save(answer);

        feedback.setAnswer(savedAnswer);

        feedback.setCreatedDate(LocalDateTime.now());

        Feedback savedFeedback = feedbackRepository.save(feedback);

        savedAnswer.setFeedback(savedFeedback);

        practiceAnswerRepository.save(savedAnswer);

        // response
        PracticeQuestionDetailResponse response = new PracticeQuestionDetailResponse();

        response.setQuestionId(practiceQuestion.getQuestion().getQuestionId());

        response.setQuestion(practiceQuestion.getQuestion().getDescription());

        response.setUserAnswer(savedAnswer.getUserAnswer());

        if (savedAnswer.getFeedback() != null) {

            response.setFeedback(savedAnswer.getFeedback().getFeedbackText());

            response.setScore(savedAnswer.getFeedback().getOverallScore());
        }

        return response;
    }

    @Transactional
    @Override
    public CommitPracticeResponse commitPractice(CommitPracticeRequest request, Integer userId) {

        PracticeSession session = practiceSessionRepository.findById(request.getSessionId()).orElseThrow(SessionNotFoundException::new);

        // check owner
        if (!session.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        // check already committed
        if (session.getEndedTime() != null) {
            throw new AssessmentAlreadyCommittedException();
        }

        // lấy answers
        List<PracticeAnswer> answers = practiceAnswerRepository.findBySessionWithDetails(request.getSessionId());

        int totalScore = 0;
        int answeredQuestions = 0;

        for (PracticeAnswer answer : answers) {

            if (answer.getFeedback() != null) {

                totalScore += answer.getFeedback().getOverallScore();

                answeredQuestions++;
            }
        }

        int averageScore = 0;

        if (answeredQuestions > 0) {
            averageScore = totalScore / answeredQuestions;
        }

        // update session
        session.setEndedTime(LocalDateTime.now());

        session.setScore(averageScore);

        practiceSessionRepository.save(session);

        // response
        CommitPracticeResponse response = new CommitPracticeResponse();

        response.setSessionId(session.getSessionId());

        response.setScore(averageScore);

        response.setAnsweredQuestions(answeredQuestions);

        response.setTotalQuestions(practiceQuestionRepository.findBySession_SessionId(session.getSessionId()).size());

        return response;
    }

}
