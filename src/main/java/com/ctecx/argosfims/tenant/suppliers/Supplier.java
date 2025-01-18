package com.ctecx.argosfims.tenant.suppliers;


import com.ctecx.argosfims.util.AuditableBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier extends AuditableBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String supplierName;
    private String location;
    private String phone;
    private String taxPin;
    private String type; // "company" or "individual"
}