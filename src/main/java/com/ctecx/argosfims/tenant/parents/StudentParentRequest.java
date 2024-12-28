package com.ctecx.argosfims.tenant.parents;

import lombok.Data;
import java.util.List;

@Data
public class StudentParentRequest {
    private Long studentId;
    private List<ParentRecord> parents;

    @Data
    public static class ParentRecord {
        private ParentType parentType;
        private ParentDetails parentDetails;
    }
}