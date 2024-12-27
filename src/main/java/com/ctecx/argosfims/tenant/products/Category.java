package com.ctecx.argosfims.tenant.products;

import jakarta.persistence.*;

import java.io.Serializable;

/**
 * @author Md. Amran Hossain
 */
@Entity
@Table(name = "tbl_category")
public class Category implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "categor_id")
    private Integer Id;
    private  String name;

}
