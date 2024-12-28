package com.ctecx.argosfims.tenant.school;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StreamUpdateDTO {
    private Integer id;
    private String streamName;
    private Boolean status;
}