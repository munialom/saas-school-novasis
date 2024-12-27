package com.ctecx.argosfims.tenant.students;

import com.ctecx.argosfims.tenant.classess.StudentClass;
import com.ctecx.argosfims.tenant.streams.StudentStream;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "students")
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "admission_number", nullable = false)
    private String admissionNumber;

    private String gender;

    private String location;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private StudentClass studentClass;

    @ManyToOne
    @JoinColumn(name = "stream_id", nullable = false)
    private StudentStream studentStream;

    private boolean status;

    @Enumerated(EnumType.STRING)
    private Admission admission;

    @Column(name = "year_of")
    private Integer yearOf;

    @Enumerated(EnumType.STRING)
    private Mode mode;
}