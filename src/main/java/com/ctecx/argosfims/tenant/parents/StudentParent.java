package com.ctecx.argosfims.tenant.parents;



import com.ctecx.argosfims.util.AuditableBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;  // Add this for JSON handling

@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "student_parents")
@Entity
public class StudentParent extends AuditableBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParentType parentType;

    @Column(columnDefinition = "TEXT")
    private String parentDetails;  // This will store the JSON string

    public ParentDetails getParentDetailsObject() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(this.parentDetails, ParentDetails.class);
        } catch (Exception e) {
            return null;
        }
    }

    public void setParentDetailsObject(ParentDetails details) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.parentDetails = mapper.writeValueAsString(details);
        } catch (Exception e) {
            this.parentDetails = null;
        }
    }
}