package com.englishapp.exception;

public class ProfileAlreadyExistsException extends RuntimeException {
    public ProfileAlreadyExistsException(Integer userId) {
        super("Profile already exists for user ID: " + userId);
    }
}
