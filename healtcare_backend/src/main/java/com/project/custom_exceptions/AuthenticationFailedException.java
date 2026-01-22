package com.project.custom_exceptions;

@SuppressWarnings("serial")
public class AuthenticationFailedException extends RuntimeException {
	public AuthenticationFailedException(String mesg) {
		super(mesg);
	}
}
