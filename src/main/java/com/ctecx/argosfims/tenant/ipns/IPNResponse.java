package com.ctecx.argosfims.tenant.ipns;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IPNResponse {
    private String transactionID;
    private Integer statusCode;
    private String statusMessage;
}