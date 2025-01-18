package com.ctecx.argosfims.tenant.transactions;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class BulkInvoice {
    private int classId;
    private LocalDate transactionDate;
    private String term;
    private List<Integer> studentIds;
    private List<Account> accounts;
    private boolean individualStudentIds;
}