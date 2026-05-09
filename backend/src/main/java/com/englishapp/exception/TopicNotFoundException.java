package com.englishapp.exception;

public class TopicNotFoundException extends RuntimeException {
    public TopicNotFoundException(Integer topicId) {
        super("Topic not found with id: " + topicId);
    }
}
