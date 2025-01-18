package com.ctecx.argosfims.tenant.transactions;

import lombok.Data;

@Data
public class StudentDTO {
    private Long id;
    private String fullName;
    private String admissionNumber;
    private String gender;
    private String location;
    private int classId;
    private String className;
    private int streamId;
    private String streamName;
    private String admission;
    private String mode;
    private Integer yearOf;


}