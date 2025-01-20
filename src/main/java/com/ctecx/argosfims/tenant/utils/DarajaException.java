package com.ctecx.argosfims.tenant.utils;

public class DarajaException extends RuntimeException {
    public DarajaException(String message) {
        super(message);
    }

    public DarajaException(String message, Throwable cause) {
        super(message, cause);
    }
}