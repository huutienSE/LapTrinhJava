package com.englishapp.service.impl;

import com.englishapp.dto.practice.AnswerRequest;
import com.englishapp.dto.assessment.*;
import com.englishapp.dto.practice.PracticeQuestionDetailResponse;
import com.englishapp.dto.practice.PracticeQuestionResponse;
import com.englishapp.entity.*;
import com.englishapp.entity.enums.Level;
import com.englishapp.entity.enums.SessionType;
import com.englishapp.entity.PracticeQuestionId;
import com.englishapp.exception.*;
import com.englishapp.repositoty.*;
import com.englishapp.service.AssessmentService;
import com.englishapp.service.DeepSeekAIService;
import com.englishapp.service.GeminiAIService;
import com.englishapp.service.QuestionService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {
    private final UserRepository userRepository;
    private final PracticeSessionRepository practiceSessionRepository;
    private final TopicRepository topicRepository;
    private final PracticeQuestionRepository practiceQuestionRepository;
    private final PracticeAnswerRepository practiceAnswerRepository;
    private final AssessmentRepository assessmentRepository;
    private final FeedbackRepository feedbackRepository;
    private final ProfileRepository profileRepository;

    private final QuestionService questionService;
    private final GeminiAIService geminiAIService;
    private final DeepSeekAIService deepSeekAIService;
    @Transactional
    @Override
    public StartAssessmentResponse startAssessment(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

        //Tạo mới 1 PracticeSession mới
        PracticeSession practiceSession = new PracticeSession();
        practiceSession.setUser(user);
        practiceSession.setSessionType(SessionType.ASSESSMENT);
        practiceSession.setStartedTime(LocalDateTime.now());

        //save Session
        PracticeSession savedSession = practiceSessionRepository.save(practiceSession);

        //Random 10 câu hỏi với topic random gồm 4 câu hỏi dể 3 câu hỏi vừa và 3 khó
        Topic topic = topicRepository.findRandomTopic();
        List<Question> questions = questionService.generateQuestionAssessment(topic.getTopicId());

        //Lưu lại session đó gồm có những câu hỏi nào trong PracticeQuestion
        List<PracticeQuestionResponse> questionResponses= new ArrayList<>();
        for (Question question : questions) {
            PracticeQuestion practiceQuestion = new PracticeQuestion(savedSession, question);
            practiceQuestionRepository.save(practiceQuestion);

            PracticeQuestionResponse practiceQuestionResponse = new PracticeQuestionResponse();
            practiceQuestionResponse.setQuestionId(question.getQuestionId());
            practiceQuestionResponse.setDescription(question.getDescription());
            questionResponses.add(practiceQuestionResponse);
        }

        //Trả ra dto gồm có sessionId và các câu hỏi List<Question>
        return new StartAssessmentResponse(savedSession.getSessionId() , questionResponses);
    }

    @Override
    public PracticeQuestionDetailResponse answerQuestionAssessment(Integer UserId, AnswerRequest answerRequest, Integer SessionId)
    {
        User user = userRepository.findById(UserId).orElseThrow(() -> new UserNotFoundException(UserId));

        PracticeSession practiceSession = practiceSessionRepository.findById(SessionId).orElseThrow(SessionNotFoundException::new);

        if(!practiceSession.getUser().getUserId().equals(user.getUserId())){
            throw new ForbiddenException();
        }

        if(practiceSession.getEndedTime() != null){
            throw new AssessmentAlreadyCommittedException();
        }

        PracticeQuestion practiceQuestion =
                practiceQuestionRepository.findById(new PracticeQuestionId(SessionId, answerRequest.getQuestionId())).orElseThrow(() -> new QuestionNotFoundException(answerRequest.getQuestionId()));

        PracticeAnswer practiceAnswer = new PracticeAnswer();
        practiceAnswer.setPracticeQuestion(practiceQuestion);
        practiceAnswer.setUserAnswer(answerRequest.getAnswer());
        practiceAnswer.setCreatedDate(LocalDateTime.now());

        PracticeAnswer savedAnswer = practiceAnswerRepository.save(practiceAnswer);

        //Tạo mới feedback
        Feedback feedback;
        //AI sẽ dựa vào câu trả loời để cho feedback và điểm
        try {

            feedback = geminiAIService.evaluateAnswer(practiceQuestion.getQuestion().getDescription(), answerRequest.getAnswer()
            );

        } catch (Exception geminiException) {
//            System.out.println(
//                    "Gemini failed: "
//                            + geminiException.getMessage()
//            );

            try {
                feedback = deepSeekAIService.evaluateAnswer(practiceQuestion.getQuestion().getDescription(), answerRequest.getAnswer());
            } catch (Exception deepSeekException) {

//                System.out.println(
//                        "DeepSeek failed: " + deepSeekException.getMessage()
//                );

                feedback = new Feedback();
                feedback.setFeedbackText("AI evaluation is temporarily unavailable. Please try again later.");
                feedback.setOverallScore(0);
            }
        }
        /*catch (Exception e) {
            e.printStackTrace();
            feedback = new Feedback();
            feedback.setFeedbackText("AI is busy now");
            feedback.setOverallScore(0);
        }
        */
        feedback.setAnswer(practiceAnswer);
        feedback.setCreatedDate(LocalDateTime.now());

        Feedback savedFeedback = feedbackRepository.save(feedback);

        savedAnswer.setFeedback(savedFeedback);

        practiceAnswerRepository.save(savedAnswer);

        return mapToQuestionDetail(practiceAnswer);
    }

    @Transactional
    @Override
    public AssessmentResponse commitAssessment(CommitAssessmentRequest request, Integer userId) {

        PracticeSession practiceSession = practiceSessionRepository.findById(request.getSessionId()).orElseThrow(SessionNotFoundException::new);
        if (practiceSession.getEndedTime() != null) {
            throw new AssessmentAlreadyCommittedException();
        }

        if (!practiceSession.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
        }
        List<PracticeAnswer> answers = practiceAnswerRepository.findBySessionWithDetails(request.getSessionId());
        int totalScore = 0;
        int countAnswer = 0;
        for(PracticeAnswer answer : answers){
            if(answer.getFeedback() != null) {
                // Kiểm tra xem feedback có phải là lỗi AI hay không
                if (!"AI evaluation is temporarily unavailable. Please try again later.".equals(answer.getFeedback().getFeedbackText())) {
                    totalScore += answer.getFeedback().getOverallScore();
                    countAnswer++;
                }
            }
        }
        
        if (countAnswer > 0) {
            totalScore = totalScore / countAnswer;
        } else {
            totalScore = 0;
        }
        
        practiceSession.setEndedTime(LocalDateTime.now());
        practiceSession.setScore(totalScore);
        practiceSessionRepository.save(practiceSession);

        Assessment assessment = new Assessment();
        assessment.setSession(practiceSession);
        assessment.setUser(practiceSession.getUser());
        assessment.setScore(totalScore);
        if(totalScore >= 70){
            assessment.setLevelAssigned(Level.ADVANCED);
        }
        else if(totalScore >= 40){
            assessment.setLevelAssigned(Level.INTERMEDIATE);
        }
        else{
            assessment.setLevelAssigned(Level.BEGINNER);
        }
        assessment.setTakenDate(LocalDateTime.now());

        Assessment savedAssessment = assessmentRepository.save(assessment);

        Profile profile = profileRepository.findByUser_UserId(userId).orElseThrow(ProfileNotFoundException::new);
        
        // Cập nhật level cho Profile dựa trên kết quả Assessment
        Level assignedLevel = assessment.getLevelAssigned();
        if(profile.getLevel() == null) {
            profile.setLevel(assignedLevel);
        }
        else {
            // Chỉ nâng cấp level, không hạ cấp hoặc giữ nguyên nếu đã cao hơn
            if (assignedLevel == Level.ADVANCED) {
                profile.setLevel(Level.ADVANCED);
            } else if (assignedLevel == Level.INTERMEDIATE && profile.getLevel() == Level.BEGINNER) {
                profile.setLevel(Level.INTERMEDIATE);
            }
        }
        profileRepository.save(profile);
        
        return mapToAssessmentResponse(savedAssessment);

    }

    @Override
    public List<ViewHistoryAssessmentResponse> viewHistoryAssessmentResponses(Integer userId) {
        List<Assessment> assessments = assessmentRepository.findByUser_UserIdOrderByTakenDateDesc(userId);
        return assessments.stream().map(this::mapToViewHistoryResponse).toList();
    }

    @Override
    public AssessmentDetailResponse getAssessmentDetail(Integer assessmentId, Integer userId) {

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(AssessmentNotFoundException::new);

        if (!assessment.getUser().getUserId().equals(userId)) {
            throw new ForbiddenException();
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