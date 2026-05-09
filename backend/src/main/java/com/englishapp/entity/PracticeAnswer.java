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
    private Integer answerId;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "session_id", referencedColumnName = "session_id", nullable = false),
            @JoinColumn(name = "question_id", referencedColumnName = "question_id", nullable = false)
    })
    private PracticeQuestion practiceQuestion;

    @OneToOne(mappedBy = "answer", cascade = CascadeType.ALL)
    private Feedback feedback;

    @Column(name = "user_answer", nullable = false)
    private String userAnswer;

    private Boolean isCorrect;

    private LocalDateTime createdDate;
}