package com.englishapp.exception;

public class QuestionAlreadyExistsException extends RuntimeException {
    public QuestionAlreadyExistsException() {
        super("Question already exists");
    }
}
