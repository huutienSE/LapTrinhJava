package com.englishapp.exception;

public class UserDisabledException extends RuntimeException{
    public UserDisabledException(){
        super("User is disabled");
    }
}
