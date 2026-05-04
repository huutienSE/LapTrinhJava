package com.englishapp.entity;

import com.englishapp.entity.enums.Level;
import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Entity
@Getter
@Table(name = "question")
public class Question {
    @Id
    @Column(name = "question_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionId;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creatorId;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    private Level difficultyLevel;

    @Column(name = "correct_answer")
    private String correctAnswer;

    @Column(name = "created_date")
    @Timestamp
    private LocalDate createdDate;
}