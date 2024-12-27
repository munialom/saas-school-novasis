package com.ctecx.argosfims.util;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@MappedSuperclass
@Data
@EntityListeners(value = {AuditingEntityListener.class})
public abstract class AuditableBase {

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false, columnDefinition = "TEXT")
    private String createdBy;    // Will store JSON of UserAudit

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime created;

    @LastModifiedBy
    @Column(name = "modified_by", nullable = false, columnDefinition = "TEXT")
    private String modifiedBy;    // Will store JSON of UserAudit

    @LastModifiedDate
    @Column(name = "last_modified_date", nullable = false)
    private LocalDateTime modified;
}