package com.englishapp.exception;
public class AssessmentNotFoundException extends RuntimeException {

    public AssessmentNotFoundException() {
        super("Assessment is not found");
    }
}
