package com.englishapp.service.impl;

import com.englishapp.dto.Question.QuestionRequest;
import com.englishapp.dto.Question.QuestionResponse;
import com.englishapp.entity.Question;
import com.englishapp.entity.Topic;
import com.englishapp.exception.QuestionAlreadyExistsException;
import com.englishapp.exception.QuestionNotFoundException;
import com.englishapp.exception.TopicNotFoundException;
import com.englishapp.mapper.QuestionMapper;
import com.englishapp.repositoty.QuestionRepository;
import com.englishapp.repositoty.TopicRepository;
import com.englishapp.service.QuestionService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;
    private final TopicRepository topicRepository;

    @Override
    public List<Question> generateQuestionAssessment(Integer topicId) {

        List<Question> question = new ArrayList<>();

        List<Question> beginner = questionRepository.findRandomByLevel(topicId, "BEGINNER", 4);

        List<Question> intermediate = questionRepository.findRandomByLevel(topicId, "INTERMEDIATE", 3);

        List<Question> advanced = questionRepository.findRandomByLevel(topicId, "ADVANCED", 3);

        if (beginner.size() < 4 || intermediate.size() < 3 || advanced.size() < 3)
        {
            throw new RuntimeException("Not enough questions to generate assessment");
        }

        question.addAll(beginner);
        question.addAll(intermediate);
        question.addAll(advanced);

        return question;
    }

    @Override
    public List<QuestionResponse> getAllQuestions() {
        List<Question> questions = questionRepository.findAllWithTopic();

        return questions.stream().map(questionMapper::toQuestionResponse).toList();
    }

    @Override
    public QuestionResponse getQuestionById(Integer topicId) {
        Question question = questionRepository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException(topicId));

        return questionMapper.toQuestionResponse(question);
    }

    @Override
    public void deleteQuestionById(Integer topicId) {
        Question question = questionRepository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException(topicId));
        questionRepository.delete(question);
    }

    @Override
    public QuestionResponse createQuestion(QuestionRequest questionRequest) {

        Topic topic = topicRepository.findById(questionRequest.getTopicId())
                .orElseThrow(() -> new TopicNotFoundException(questionRequest.getTopicId()));

        if (questionRepository.existsQuestionByDescription(questionRequest.getDescription())) {
            throw new QuestionAlreadyExistsException();
        }

        Question question = questionMapper.toQuestion(questionRequest);
        question.setTopic(topic);
        question.setCreatedDate(LocalDateTime.now());
        Question questionUpdated = questionRepository.save(question);
        return questionMapper.toQuestionResponse(questionUpdated);

    }

    @Override
    public QuestionResponse updateQuestion(QuestionRequest questionRequest, Integer questionId) {

        Topic topic = topicRepository.findById(questionRequest.getTopicId())
                .orElseThrow(() -> new TopicNotFoundException(questionRequest.getTopicId()));

        if (!questionRepository.existsById(questionId)) {
            throw new QuestionNotFoundException(questionId);
        }

        Question question = questionMapper.toQuestion(questionRequest);
        question.setTopic(topic);
        question.setCreatedDate(LocalDateTime.now());
        Question questionUpdated = questionRepository.save(question);
        return questionMapper.toQuestionResponse(questionUpdated);
    }
}