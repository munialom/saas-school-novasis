package com.ctecx.argosfims.tenant.finance;



import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllocationResultDTO {
    private List<VoteheadDTO> voteheadDTOS;
    private boolean hasOverpayment;
    private AccountChart overpaymentAccount;
}