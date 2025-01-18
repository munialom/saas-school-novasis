package com.ctecx.argosfims.tenant.utils;

public class TransactionException extends RuntimeException {
    private final String errorCode;

    public TransactionException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public static class InvalidAmountException extends TransactionException {
        public InvalidAmountException(String message) {
            super(message, "INVALID_AMOUNT");
        }
    }

    public static class UnbalancedTransactionException extends TransactionException {
        public UnbalancedTransactionException(String message) {
            super(message, "UNBALANCED_TRANSACTION");
        }
    }

    public static class InvalidAccountGroupException extends TransactionException {
        public InvalidAccountGroupException(String message) {
            super(message, "INVALID_ACCOUNT_GROUP");
        }
    }

    // Add new exception type for input validation
    public static class InvalidInputException extends TransactionException {
        public InvalidInputException(String message, String field) {
            super(message, "INVALID_INPUT_" + field.toUpperCase());
        }
    }
}