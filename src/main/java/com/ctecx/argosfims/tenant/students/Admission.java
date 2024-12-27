package com.ctecx.argosfims.tenant.students;

import com.fasterxml.jackson.annotation.JsonCreator;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Admission {
    SESSION("Session"),
    TRANSFER("Transfer"),
    ALUMNI("Alumni");

    private final String displayText;

    Admission(String displayText) {
        this.displayText = displayText;
    }

    @JsonValue
    public String getDisplayText() {
        return displayText;
    }

    @JsonCreator
    public static Admission fromString(String value) {
        if (value == null) {
            return null;
        }

        for (Admission admission : Admission.values()) {
            if (admission.name().equalsIgnoreCase(value) ||
                    admission.getDisplayText().equalsIgnoreCase(value)) {
                return admission;
            }
        }
        throw new IllegalArgumentException("Invalid Admission value: " + value);
    }
}