package com.ctecx.argosfims.tenant.parents;


import lombok.Data;
import java.util.List;

@Data
public class ParentDetails {
    private String fullName;
    private List<String> phoneNumbers;  // Can store multiple phone numbers
    private String emailAddress;
}
