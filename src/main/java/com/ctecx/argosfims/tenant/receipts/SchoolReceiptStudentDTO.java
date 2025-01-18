package com.ctecx.argosfims.tenant.receipts;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class SchoolReceiptStudentDTO {
    private String studentName;
    private String admissionNumber;
    private String className;
    private String streamName;
}