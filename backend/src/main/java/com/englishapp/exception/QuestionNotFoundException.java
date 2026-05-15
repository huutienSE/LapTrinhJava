package com.englishapp.exception;

public class QuestionNotFoundException extends RuntimeException {
    public QuestionNotFoundException(Integer questionId) {
        super("Question with id " + questionId + " not found");
    }
}
