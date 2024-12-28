package com.ctecx.argosfims.tenant.streams;

import com.ctecx.argosfims.util.AuditableBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "streams")
@Entity
public class StudentStream extends AuditableBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "stream_name", nullable = false)
    private String streamName;

    private boolean status;
}