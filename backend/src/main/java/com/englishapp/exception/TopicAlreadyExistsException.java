package com.englishapp.exception;

public class TopicAlreadyExistsException extends RuntimeException {
    public TopicAlreadyExistsException(String topicName) {
        super("Topic '" + topicName + "' already exists");
    }
}
