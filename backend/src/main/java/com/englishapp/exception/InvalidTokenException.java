package com.englishapp.exception;

public class InvalidTokenException extends RuntimeException{
    public InvalidTokenException(){
        super("Invalid or expired token");
    }
    public InvalidTokenException(String message){
        super(message);
    }
}
