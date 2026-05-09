package com.englishapp.service.impl;

import com.englishapp.entity.Question;
import com.englishapp.repositoty.QuestionRepository;
import com.englishapp.service.QuestionService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

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
}