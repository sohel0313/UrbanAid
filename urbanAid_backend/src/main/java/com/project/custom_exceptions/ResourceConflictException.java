package com.project.custom_exceptions;

@SuppressWarnings("serial")
public class ResourceConflictException extends RuntimeException {
    public ResourceConflictException(String message) {
        super(message);
    }
}
