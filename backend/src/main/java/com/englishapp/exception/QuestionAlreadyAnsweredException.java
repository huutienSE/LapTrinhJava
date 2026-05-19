package com.englishapp.exception;

public class QuestionAlreadyAnsweredException extends RuntimeException {

    public QuestionAlreadyAnsweredException() {
        super("Question already answered");
    }
}