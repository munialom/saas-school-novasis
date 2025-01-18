package com.ctecx.argosfims.tenant.utils;

public class EmailResult {
    private final boolean success;
    private final String message;

    public EmailResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}