package com.englishapp.exception;

public class UserNotFound extends RuntimeException {
    public UserNotFound(Integer userId) {
        super("User not found with id: " + userId);
    }
}
