package com.ctecx.argosfims.tenant.students;

import lombok.Data;


@Data
public class StudentDTO {
    private String fullName;
    private String admissionNumber;
    private String gender;
    private String location;
    private Integer classId;
    private Integer streamId;
    private boolean status;
    private Admission admission;
    private int yearOf;
    private Mode mode;


}
