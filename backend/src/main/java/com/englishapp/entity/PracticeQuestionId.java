package com.englishapp.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class PracticeQuestionId implements Serializable {

    private Integer sessionId;
    private Integer questionId;

    public PracticeQuestionId() {}

    public PracticeQuestionId(Integer sessionId, Integer questionId) {
        this.sessionId = sessionId;
        this.questionId = questionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PracticeQuestionId)) return false;
        PracticeQuestionId that = (PracticeQuestionId) o;
        return Objects.equals(sessionId, that.sessionId) &&
                Objects.equals(questionId, that.questionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sessionId, questionId);
    }
}