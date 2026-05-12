package com.englishapp.dto.question;

import com.englishapp.entity.enums.Level;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class QuestionResponse {

    private Integer questionId;

    private String description;

    private String correctAnswer;

    private Level difficultyLevel;

    private Integer topicId;

    private String topicName;

    private LocalDateTime createdDate;
}
