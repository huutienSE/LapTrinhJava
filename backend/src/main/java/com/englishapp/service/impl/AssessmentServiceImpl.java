package com.englishapp.service.impl;

import com.englishapp.dto.PracticeAnswer.AnswerRequest;
import com.englishapp.dto.assessment.AssessmentDetailResponse;
import com.englishapp.dto.assessment.AssessmentResponse;
import com.englishapp.dto.assessment.CommitAssessmentRequest;
import com.englishapp.dto.assessment.ViewHistoryAssessmentResponse;
import com.englishapp.dto.question.PracticeQuestionDetailResponse;
import com.englishapp.entity.*;
import com.englishapp.entity.enums.Level;
import com.englishapp.entity.enums.SessionType;
import com.englishapp.entity.PracticeQuestionId;
import com.englishapp.repositoty.*;
import com.englishapp.service.QuestionService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class AssessmentServiceImpl implements com.englishapp.service.AssessmentService {
    UserRepository userRepository;
    PracticeSessionRepository practiceSessionRepository;
    TopicRepository topicRepository;
    PracticeQuestionRepository practiceQuestionRepository;
    QuestionRepository questionRepository;
    PracticeAnswerRepository practiceAnswerRepository;
    AssessmentRepository assessmentRepository;

    QuestionService questionService;

    @Override
    public Integer startAssessment(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User is not found"));

        PracticeSession practiceSession = new PracticeSession();
        practiceSession.setUser(user);
        practiceSession.setSessionType(SessionType.ASSESSMENT);
        practiceSession.setStartedTime(LocalDateTime.now());

        practiceSessionRepository.save(practiceSession);

        Topic topic = topicRepository.findRandomTopic();

        List<Question> questions = questionService.generateQuestionAssessment(topic.getTopicId());

        for (Question q : questions) {
            practiceQuestionRepository.save(new PracticeQuestion(practiceSession, q));
        }

        return practiceSession.getSessionId();
    }

    @Override
    @Transactional
    public AssessmentResponse commitAssessment(CommitAssessmentRequest request,
                                               Integer userId) {

        PracticeSession practiceSession = practiceSessionRepository
                .findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session is not found"));

        if (practiceSession.getEndedTime() != null) {
            throw new RuntimeException("Assessment already committed");
        }

        if (!practiceSession.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You do not have permission");
        }

        List<PracticeAnswer> answers = practiceAnswerRepository.findBySessionWithDetails(practiceSession.getSessionId());

        int totalScore = answers.stream()
                .filter(a -> a.getFeedback() != null)
                .mapToInt(a -> a.getFeedback().getOverallScore())
                .sum();

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
        }
        else if (totalScore >= 50) {
            assessment.setLevelAssigned(Level.INTERMEDIATE);
        }
        else {
            assessment.setLevelAssigned(Level.BEGINNER);
        }

        Assessment saved = assessmentRepository.save(assessment);

        return mapToAssessmentResponse(saved);
    }

    @Override
    public List<ViewHistoryAssessmentResponse> viewHistoryAssessmentResponses(Integer userId) {
        List<Assessment> assessments = assessmentRepository.findByUser_UserIdOrderByTakenDateDesc(userId);

        return assessments.stream()
                .map(this::mapToViewHistoryResponse)
                .toList();
    }

    @Override
    public AssessmentDetailResponse getAssessmentDetail(Integer assessmentId, Integer userId) {

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment is not found"));

        if (!assessment.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You do not have permission to view this assessment");
        }

        List<PracticeAnswer> answers = practiceAnswerRepository.findBySessionWithDetails(assessment.getSession().getSessionId());

        List<PracticeQuestionDetailResponse> questions = answers.stream()
                .map(this::mapToQuestionDetail)
                .toList();

        AssessmentDetailResponse assessmentDetailResponse = new AssessmentDetailResponse();
        assessmentDetailResponse.setAssessmentId(assessment.getAssessmentId());
        assessmentDetailResponse.setScore(assessment.getScore());
        assessmentDetailResponse.setLevelAssigned(assessment.getLevelAssigned());
        assessmentDetailResponse.setTakenDate(assessment.getTakenDate());
        assessmentDetailResponse.setQuestions(questions);

        return assessmentDetailResponse;
    }

    private PracticeQuestionDetailResponse mapToQuestionDetail(PracticeAnswer answer) {

        PracticeQuestionDetailResponse practiceQuestionDetailResponse = new PracticeQuestionDetailResponse();
        practiceQuestionDetailResponse.setQuestionId(answer.getPracticeQuestion().getQuestion().getQuestionId());
        practiceQuestionDetailResponse.setQuestion(answer.getPracticeQuestion().getQuestion().getDescription());
        practiceQuestionDetailResponse.setUserAnswer(answer.getUserAnswer());

        if (answer.getFeedback() != null) {
            practiceQuestionDetailResponse.setFeedback(answer.getFeedback().getFeedbackText());
            practiceQuestionDetailResponse.setScore(answer.getFeedback().getOverallScore());
        } else {
            practiceQuestionDetailResponse.setFeedback("No feedback");
            practiceQuestionDetailResponse.setScore(0);
        }

        return practiceQuestionDetailResponse;
    }

    private AssessmentResponse mapToAssessmentResponse(Assessment assessment) {
        AssessmentResponse assessmentResponse = new AssessmentResponse();
        assessmentResponse.setAssessmentId(assessment.getAssessmentId());
        assessmentResponse.setSessionId(assessment.getSession().getSessionId());
        assessmentResponse.setUserId(assessment.getUser().getUserId());
        assessmentResponse.setScore(assessment.getScore());
        assessmentResponse.setLevelAssigned(String.valueOf(assessment.getLevelAssigned()));
        assessmentResponse.setTakenDate(assessment.getTakenDate());
        return assessmentResponse;
    }

    private ViewHistoryAssessmentResponse mapToViewHistoryResponse(Assessment assessment) {
        ViewHistoryAssessmentResponse viewHistoryAssessmentResponse = new ViewHistoryAssessmentResponse();
        viewHistoryAssessmentResponse.setAssessmentId(assessment.getAssessmentId());
        viewHistoryAssessmentResponse.setSessionId(assessment.getSession().getSessionId());
        viewHistoryAssessmentResponse.setScore(assessment.getScore());
        viewHistoryAssessmentResponse.setLevelAssigned(String.valueOf(assessment.getLevelAssigned()));
        viewHistoryAssessmentResponse.setTakenDate(assessment.getTakenDate());
        return viewHistoryAssessmentResponse;
    }
}