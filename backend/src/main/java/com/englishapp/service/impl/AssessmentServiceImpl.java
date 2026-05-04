package com.englishapp.service.impl;

import com.englishapp.dto.PracticeAnswer.AnswerRequest;
import com.englishapp.dto.assessment.AssessmentResponse;
import com.englishapp.dto.assessment.CommitAssessmentRequest;
import com.englishapp.dto.assessment.StartAssessmentRequest;
import com.englishapp.entity.*;
import com.englishapp.entity.enums.Level;
import com.englishapp.entity.enums.SessionType;
import com.englishapp.repositoty.*;
import com.englishapp.service.QuestionService;
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
    public Integer startAssessment(StartAssessmentRequest startAssessmentRequest)
    {
        User user = userRepository.findById(startAssessmentRequest.getUserId())
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
    public AssessmentResponse commitAssessment(CommitAssessmentRequest request)
    {
        PracticeSession practiceSession = practiceSessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session is not found"));
        int score = 0;

        for(AnswerRequest answer : request.getAnswers())
        {
            Question question = questionRepository.findById(answer.getQuestionId()).orElseThrow();

            boolean isCorrect = answer.getAnswer().equals(question.getCorrectAnswer());
            if (isCorrect) score++;

            PracticeAnswer practiceAnswer = new PracticeAnswer();
            practiceAnswer.setSession(practiceSession);
            practiceAnswer.setQuestion(question);
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
        assessment.setScore(score);
        assessment.setTakenDate(LocalDateTime.now());

        if (score >= 8) assessment.setLevelAssigned(Level.ADVANCED);
        else if (score >= 5) assessment.setLevelAssigned(Level.INTERMEDIATE);
        else assessment.setLevelAssigned(Level.BEGINNER);

        Assessment saved = assessmentRepository.save(assessment);
        return mapToAssessmentResponse(saved);
    }

    @Override
    public AssessmentResponse mapToAssessmentResponse(Assessment assessment)
    {
        AssessmentResponse assessmentResponse = new AssessmentResponse();
        assessmentResponse.setAssessmentId(assessment.getAssessmentId());
        assessmentResponse.setUserId(assessment.getUser().getUserId());
        assessmentResponse.setScore(assessment.getScore());
        assessmentResponse.setLevelAssigned(String.valueOf(assessment.getLevelAssigned()));
        assessmentResponse.setTakenDate(assessment.getTakenDate());
        return assessmentResponse;
    }

}