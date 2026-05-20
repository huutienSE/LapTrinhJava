package com.englishapp.exception;

public class RoleNotFoundException extends RuntimeException{
    public RoleNotFoundException() {
        super("Role not found");
    }
}
