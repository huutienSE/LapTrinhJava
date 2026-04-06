package com.englishapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "practice_answer")
@Getter
@Setter
public class PracticeAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Integer answerId;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private PracticeSession session;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private PracticeQuestion question;

    @Column(name = "user_answer")
    private String userAnswer;

    @Column(name = "created_date")
    private LocalDateTime createdDate;
}
