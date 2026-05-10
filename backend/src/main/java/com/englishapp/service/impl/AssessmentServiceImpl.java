package com.englishapp.service.impl;

import com.englishapp.dto.PracticeAnswer.AnswerRequest;
import com.englishapp.dto.assessment.AssessmentResponse;
import com.englishapp.dto.assessment.CommitAssessmentRequest;
import com.englishapp.dto.assessment.StartAssessmentRequest;
import com.englishapp.dto.assessment.ViewHistoryAssessmentResponse;
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
    public AssessmentResponse commitAssessment(CommitAssessmentRequest request, Integer userId) {
        PracticeSession practiceSession = practiceSessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session is not found"));

        if (practiceSession.getEndedTime() != null) {
            throw new RuntimeException("Assessment already committed");
        }
        if (!practiceSession.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You do not have permission to commit this assessment");
        }

        int score = 0;

        for (AnswerRequest answer : request.getAnswers()) {
            Question question = questionRepository.findById(answer.getQuestionId()).orElseThrow();

            boolean isCorrect = answer.getAnswer().equals(question.getCorrectAnswer());
            if (isCorrect) score++;

            PracticeQuestion practiceQuestion = practiceQuestionRepository
                    .findById(new PracticeQuestionId(practiceSession.getSessionId(), question.getQuestionId()))
                    .orElseThrow();

            PracticeAnswer practiceAnswer = new PracticeAnswer();
            practiceAnswer.setPracticeQuestion(practiceQuestion);
            practiceAnswer.setUserAnswer(answer.getAnswer());
            practiceAnswer.setIsCorrect(isCorrect);
            practiceAnswer.setCreatedDate(LocalDateTime.now());

            practiceAnswerRepository.save(practiceAnswer);
        }
        practiceSession.setScore(score);
        practiceSession.setEndedTime(LocalDateTime.now());
        practiceSessionRepository.save(practiceSession);

        Assessment assessment = new Assessment();
        assessment.setUser(practiceSession.getUser());
        assessment.setSession(practiceSession);
        assessment.setScore(score);
        assessment.setTakenDate(LocalDateTime.now());

        if (score >= 8) assessment.setLevelAssigned(Level.ADVANCED);
        else if (score >= 5) assessment.setLevelAssigned(Level.INTERMEDIATE);
        else assessment.setLevelAssigned(Level.BEGINNER);

        Assessment saved = assessmentRepository.save(assessment);
        return mapToAssessmentResponse(saved);
    }

    @Override
    public List<ViewHistoryAssessmentResponse> viewHistoryAssessmentResponses(Integer userId) {
        List<Assessment> assessments =
                assessmentRepository.findByUser_UserIdOrderByTakenDateDesc(userId);

        return assessments.stream()
                .map(this::mapToViewHistoryResponse)
                .toList();
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
        ViewHistoryAssessmentResponse response = new ViewHistoryAssessmentResponse();
        response.setAssessmentId(assessment.getAssessmentId());
        response.setSessionId(assessment.getSession().getSessionId());
        response.setScore(assessment.getScore());
        response.setLevelAssigned(assessment.getLevelAssigned().name());
        response.setTakenDate(assessment.getTakenDate());
        return response;
    }
}