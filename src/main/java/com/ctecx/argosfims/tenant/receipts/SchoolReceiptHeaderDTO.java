package com.ctecx.argosfims.tenant.receipts;



import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class SchoolReceiptHeaderDTO {
    private String serialNumber;
    private String term;
}