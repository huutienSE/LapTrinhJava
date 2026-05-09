package com.englishapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "practice_question")
@Getter
@Setter
public class PracticeQuestion {

    @EmbeddedId
    private PracticeQuestionId id;

    public PracticeQuestion() {}

    public PracticeQuestion(PracticeSession session, Question question) {
        this.session = session;
        this.question = question;
        this.id = new PracticeQuestionId(
                session.getSessionId(),
                question.getQuestionId()
        );
    }

    @ManyToOne
    @MapsId("sessionId")
    @JoinColumn(name = "session_id")
    private PracticeSession session;

    @ManyToOne
    @MapsId("questionId")
    @JoinColumn(name = "question_id")
    private Question question;
}