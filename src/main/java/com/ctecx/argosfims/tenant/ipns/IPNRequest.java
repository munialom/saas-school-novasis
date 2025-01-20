package com.ctecx.argosfims.tenant.ipns;

import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class IPNRequest {
    @NotNull
    private String transactionReference;

    @NotNull
    private String requestId;

    @NotNull
    private String channelCode;

    @NotNull
    private String timestamp;

    @NotNull
    private String transactionAmount;

    @NotNull
    private String currency;

    @NotNull
    private String customerReference;

    @NotNull
    private String customerName;

    @NotNull
    private String customerMobileNumber;

    @NotNull
    private String balance;

    @NotNull
    private String narration;

    @NotNull
    private String creditAccountIdentifier;

    @NotNull
    private String organizationShortCode;

    @NotNull
    private String tillNumber;
}