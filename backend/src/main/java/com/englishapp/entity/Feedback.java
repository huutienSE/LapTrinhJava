package com.englishapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter
@Setter
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer feedbackId;

    @OneToOne
    @JoinColumn(name = "answer_id", nullable = false, unique = true)
    private PracticeAnswer answer;

    private Integer overallScore;

    private String feedbackText;

    private LocalDateTime createdDate;
}