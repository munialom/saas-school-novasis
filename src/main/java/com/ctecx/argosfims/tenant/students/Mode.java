package com.ctecx.argosfims.tenant.students;

import com.fasterxml.jackson.annotation.JsonCreator;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Mode {
    BOARDING("Boarding"),
    DAY("Day Scholar");

    private final String displayText;

    Mode(String displayText) {
        this.displayText = displayText;
    }

    @JsonValue
    public String getDisplayText() {
        return displayText;
    }

    @JsonCreator
    public static Mode fromString(String value) {
        if (value == null) {
            return null;
        }

        for (Mode mode : Mode.values()) {
            if (mode.name().equalsIgnoreCase(value) ||
                    mode.getDisplayText().equalsIgnoreCase(value)) {
                return mode;
            }
        }
        throw new IllegalArgumentException("Invalid Mode value: " + value);
    }
}