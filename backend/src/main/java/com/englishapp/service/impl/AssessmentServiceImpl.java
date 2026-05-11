package com.englishapp.service.impl;

import com.englishapp.dto.PracticeAnswer.AnswerRequest;
import com.englishapp.dto.assessment.*;
import com.englishapp.dto.question.PracticeQuestionDetailResponse;
import com.englishapp.dto.question.PracticeQuestionResponse;
import com.englishapp.entity.*;
import com.englishapp.entity.enums.Level;
import com.englishapp.entity.enums.SessionType;
import com.englishapp.exception.*;
import com.englishapp.repositoty.*;
import com.englishapp.service.AssessmentService;
import com.englishapp.service.GeminiAIService;
import com.englishapp.service.QuestionService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {

    private final UserRepository userRepository;
    private final PracticeSessionRepository practiceSessionRepository;
    private final TopicRepository topicRepository;
    private final PracticeQuestionRepository practiceQuestionRepository;
    private final QuestionRepository questionRepository;
    private final PracticeAnswerRepository practiceAnswerRepository;
    private final AssessmentRepository assessmentRepository;
    private final FeedbackRepository feedbackRepository;

    private final QuestionService questionService;
    private final GeminiAIService geminiAIService;

    @Override
    @Transactional
    public StartAssessmentResponse startAssessment(Integer userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

        PracticeSession practiceSession = new PracticeSession();
        practiceSession.setUser(user);
        practiceSession.setSessionType(SessionType.ASSESSMENT);
        practiceSession.setStartedTime(LocalDateTime.now());

        practiceSessionRepository.save(practiceSession);

        Topic topic = topicRepository.findRandomTopic();

        List<Question> questions = questionService.generateQuestionAssessment(topic.getTopicId());

        List<PracticeQuestionResponse> questionResponses = new java.util.ArrayList<>();

        for (Question question : questions) {
            PracticeQuestion practiceQuestion = new PracticeQuestion(practiceSession, question);
            practiceQuestionRepository.save(practiceQuestion);

            // Tạo sẵn câu trả lời trống
            PracticeAnswer answer = new PracticeAnswer();
            answer.setPracticeQuestion(practiceQuestion);
            answer.setUserAnswer(""); // Trống
            answer.setCreatedDate(LocalDateTime.now());
            practiceAnswerRepository.save(answer);

            PracticeQuestionResponse qResponse = new PracticeQuestionResponse();
            qResponse.setQuestionId(question.getQuestionId());
            qResponse.setDescription(question.getDescription());
            questionResponses.add(qResponse);
        }

        return new StartAssessmentResponse(practiceSession.getSessionId(), questionResponses);
    }

    @Override
    @Transactional
    public PracticeQuestionDetailResponse saveAnswer(Integer sessionId, AnswerRequest request, Integer userId) {

        PracticeSession session = practiceSessionRepository.findById(sessionId).orElseThrow(SessionNotFoundException::new);

        if (!session.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        if (session.getEndedTime() != null) {
            throw new AssessmentAlreadyCommittedException();
        }

        PracticeQuestion practiceQuestion = practiceQuestionRepository.findById(new PracticeQuestionId(sessionId, request.getQuestionId())).orElseThrow(QuestionNotFoundException::new);

        //Xem thử user đã trả lời chưa chưa thì tạo mới còn rồi thì update lại
        PracticeAnswer answer = practiceAnswerRepository.findByPracticeQuestion(sessionId, request.getQuestionId()).orElse(null);

        if (answer == null) {
            answer = new PracticeAnswer();
            answer.setPracticeQuestion(practiceQuestion);
            answer.setCreatedDate(LocalDateTime.now());
        }

        answer.setUserAnswer(request.getAnswer());

        practiceAnswerRepository.save(answer);

        Feedback feedback;

        try {
            feedback = geminiAIService.evaluateAnswer(practiceQuestion.getQuestion().getDescription(), request.getAnswer());
        } catch (Exception e) {
            e.printStackTrace();
            feedback = new Feedback();
            feedback.setFeedbackText("AI is busy now");
            feedback.setOverallScore(0);
        }

        feedback.setAnswer(answer);
        feedback.setCreatedDate(LocalDateTime.now());

        feedbackRepository.save(feedback);

        answer.setFeedback(feedback);

        practiceAnswerRepository.save(answer);

        return mapToQuestionDetail(answer);
    }

    @Override
    @Transactional
    public AssessmentResponse commitAssessment(CommitAssessmentRequest request, Integer userId) {

        PracticeSession practiceSession = practiceSessionRepository.findById(request.getSessionId()).orElseThrow(SessionNotFoundException::new);

        if (practiceSession.getEndedTime() != null) {
            throw new AssessmentAlreadyCommittedException();
        }

        if (!practiceSession.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        List<PracticeAnswer> answers = practiceAnswerRepository.findBySessionWithDetails(practiceSession.getSessionId());

        int totalScore = answers.stream().filter(answer -> answer.getFeedback() != null).mapToInt(answer -> answer.getFeedback().getOverallScore()).sum();

        practiceSession.setScore(totalScore);
        practiceSession.setEndedTime(LocalDateTime.now());

        practiceSessionRepository.save(practiceSession);

        Assessment assessment = new Assessment();

        assessment.setUser(practiceSession.getUser());
        assessment.setSession(practiceSession);
        assessment.setScore(totalScore);
        assessment.setTakenDate(LocalDateTime.now());

        if (totalScore >= 80) {
            assessment.setLevelAssigned(Level.ADVANCED);
        } else if (totalScore >= 50) {
            assessment.setLevelAssigned(Level.INTERMEDIATE);
        } else {
            assessment.setLevelAssigned(Level.BEGINNER);
        }

        Assessment saved = assessmentRepository.save(assessment);

        return mapToAssessmentResponse(saved);
    }

    @Override
    public List<ViewHistoryAssessmentResponse> viewHistoryAssessmentResponses(Integer userId) {

        List<Assessment> assessments = assessmentRepository.findByUser_UserIdOrderByTakenDateDesc(userId);

        return assessments.stream().map(this::mapToViewHistoryResponse).toList();
    }

    @Override
    public AssessmentDetailResponse getAssessmentDetail(Integer assessmentId, Integer userId) {

        Assessment assessment = assessmentRepository.findById(assessmentId).orElseThrow(AssessmentNotFoundException::new);

        if (!assessment.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }

        List<PracticeAnswer> answers = practiceAnswerRepository.findBySessionWithDetails(assessment.getSession().getSessionId());

        List<PracticeQuestionDetailResponse> questions = answers.stream().map(this::mapToQuestionDetail).toList();

        AssessmentDetailResponse response = new AssessmentDetailResponse();

        response.setAssessmentId(assessment.getAssessmentId());
        response.setScore(assessment.getScore());
        response.setLevelAssigned(assessment.getLevelAssigned());
        response.setTakenDate(assessment.getTakenDate());
        response.setQuestions(questions);

        return response;
    }

    private PracticeQuestionDetailResponse mapToQuestionDetail(PracticeAnswer answer) {

        PracticeQuestionDetailResponse response = new PracticeQuestionDetailResponse();

        response.setQuestionId(answer.getPracticeQuestion().getQuestion().getQuestionId());

        response.setQuestion(answer.getPracticeQuestion().getQuestion().getDescription());

        response.setUserAnswer(answer.getUserAnswer());

        if (answer.getFeedback() != null) {

            response.setFeedback(answer.getFeedback().getFeedbackText());

            response.setScore(answer.getFeedback().getOverallScore());

        } else {

            response.setFeedback("No feedback");
            response.setScore(0);
        }

        return response;
    }

    private AssessmentResponse mapToAssessmentResponse(Assessment assessment) {

        AssessmentResponse response = new AssessmentResponse();

        response.setAssessmentId(assessment.getAssessmentId());
        response.setSessionId(assessment.getSession().getSessionId());
        response.setUserId(assessment.getUser().getUserId());
        response.setScore(assessment.getScore());
        response.setLevelAssigned(String.valueOf(assessment.getLevelAssigned()));
        response.setTakenDate(assessment.getTakenDate());

        return response;
    }

    private ViewHistoryAssessmentResponse mapToViewHistoryResponse(Assessment assessment) {

        ViewHistoryAssessmentResponse response = new ViewHistoryAssessmentResponse();

        response.setAssessmentId(assessment.getAssessmentId());

        response.setSessionId(assessment.getSession().getSessionId());

        response.setScore(assessment.getScore());

        response.setLevelAssigned(String.valueOf(assessment.getLevelAssigned()));

        response.setTakenDate(assessment.getTakenDate());

        return response;
    }
}