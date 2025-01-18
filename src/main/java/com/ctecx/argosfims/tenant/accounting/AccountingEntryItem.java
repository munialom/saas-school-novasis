package com.ctecx.argosfims.tenant.accounting;



import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class AccountingEntryItem {
    private String accountName;
    private boolean isDebit;
    private BigDecimal amount;
}