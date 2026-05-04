package com.englishapp.exception;

public class TopiicNotFoundException extends RuntimeException {
    public TopiicNotFoundException(Integer topicId) {
        super("Topic not found with id: " + topicId);
    }
}
