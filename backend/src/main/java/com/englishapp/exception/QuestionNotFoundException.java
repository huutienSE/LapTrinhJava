package com.englishapp.exception;

public class QuestionNotFoundException extends RuntimeException{
    public QuestionNotFoundException(){
        super("No question found");
    }
}
