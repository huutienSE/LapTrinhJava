package com.englishapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter
@Setter
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Integer feedbackId;

    @OneToOne
    @JoinColumn(name = "answer_id")
    private PracticeAnswer answer;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "feedback_text")
    private String feedbackText;

    @Column(name = "created_date")
    private LocalDateTime createdDate;
}