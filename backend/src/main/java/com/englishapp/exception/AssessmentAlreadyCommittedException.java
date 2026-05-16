package com.englishapp.exception;

public class AssessmentAlreadyCommittedException extends RuntimeException {

    public AssessmentAlreadyCommittedException() {
        super("Assessment already committed");
    }
}