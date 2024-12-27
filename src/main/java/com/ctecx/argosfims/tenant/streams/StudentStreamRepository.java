package com.ctecx.argosfims.tenant.streams;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentStreamRepository extends JpaRepository<StudentStream, Integer> {

}