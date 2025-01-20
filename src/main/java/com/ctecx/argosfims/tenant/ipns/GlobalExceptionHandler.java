package com.ctecx.argosfims.tenant.ipns;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<IPNResponse> handleMissingHeader(MissingRequestHeaderException ex) {
        log.error("Missing required header: {}", ex.getHeaderName());
        return ResponseEntity.badRequest().body(
                IPNResponse.builder()
                        .transactionID("UNKNOWN")
                        .statusCode(1)
                        .statusMessage("Error: Missing required " + ex.getHeaderName() + " header")
                        .build()
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResourceFound(NoResourceFoundException ex) {
        // Don't log favicon.ico resource not found as error since it's expected
        if (ex.getMessage().contains("favicon.ico")) {
            return ResponseEntity.notFound().build();
        }

        // Log other resource not found errors
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<IPNResponse> handleGenericError(Exception ex) {
        // Skip logging for favicon.ico errors
        if (!(ex instanceof NoResourceFoundException &&
                ex.getMessage().contains("favicon.ico"))) {
            log.error("Unexpected error processing request", ex);
        }

        return ResponseEntity.internalServerError().body(
                IPNResponse.builder()
                        .transactionID("UNKNOWN")
                        .statusCode(1)
                        .statusMessage("Error: Internal server error")
                        .build()
        );
    }
}