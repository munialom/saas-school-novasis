package com.ctecx.argosfims.tenant.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ValidationResponse {
    @JsonProperty("ResultCode")
    public String resultCode;
    @JsonProperty("ResultDesc")
    public String resultDesc;
}
