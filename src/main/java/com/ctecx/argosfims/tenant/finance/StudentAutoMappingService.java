/*
package com.ctecx.argosfims.tenant.finance;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentAutoMappingService {

    private final CustomFinanceRepository customFinanceRepository;
    private final AccountChartService accountChartService;

    public List<AccountBalanceDTO> getAccountChartBalancesByStudentIdAutomapping(int studentId) {
        log.info("Fetching account chart balances for student ID: {}", studentId);
        List<Map<String, Object>> rawData = customFinanceRepository.GetAccountChartBalancesByStudentId(studentId);
        List<AccountBalanceDTO> accountBalanceDTOS = mapToAccountBalanceDTOList(rawData);
        log.debug("Account chart balances fetched successfully for student ID {}: {}", studentId, accountBalanceDTOS);
        return accountBalanceDTOS;
    }

    private List<AccountBalanceDTO> mapToAccountBalanceDTOList(List<Map<String, Object>> rawData) {
        return rawData.stream()
                .map(this::mapToAccountBalanceDTO)
                .collect(Collectors.toList());
    }

    private AccountBalanceDTO mapToAccountBalanceDTO(Map<String, Object> data) {
        Integer id = (Integer) data.get("id");
        String accountName = (String) data.get("account_name");
        Double balance;
        Object balanceObject = data.get("balance");
        if (balanceObject instanceof Double) {
            balance = (Double) balanceObject;
        } else if (balanceObject instanceof java.math.BigDecimal) {
            balance = ((java.math.BigDecimal) balanceObject).doubleValue();
        } else {
            balance = 0.0;
        }

        // Trim whitespace from accountName
        if (accountName != null) {
            accountName = accountName.trim();
        }
        AccountBalanceDTO accountBalanceDTO = new AccountBalanceDTO(id, accountName, balance);
        log.debug("Account balance mapped : {}", accountBalanceDTO);
        return accountBalanceDTO;
    }


    public AllocationResultDTO allocatePayment(int studentId, double amountPaid) {
        log.info("Starting payment allocation for student ID: {}, with amount paid: {}", studentId, amountPaid);
        List<AccountBalanceDTO> accountBalances = getAccountChartBalancesByStudentIdAutomapping(studentId);

        List<VoteheadDTO> voteheads = accountBalances.stream().map(accountBalanceDTO -> new VoteheadDTO(
                accountBalanceDTO.getAccountName(), accountBalanceDTO.getBalance(), 0
        )).collect(Collectors.toList());
        log.debug("Voteheads initialized: {}", voteheads);

        double remainingPayment = amountPaid;
        log.debug("Initial Remaining Payment: {}", remainingPayment);

        // 3. Distribute Payment
        for (VoteheadDTO votehead : voteheads) {
            log.debug("\nProcessing votehead: " + votehead.getName());
            double remainingCost = votehead.getInitialCost() - votehead.getPaidAmount();
            log.debug("   Remaining cost for " + votehead.getName() + ": " + remainingCost);

            if (remainingPayment > 0) {
                double payment = Math.min(remainingPayment, remainingCost);
                log.debug("   Payment Allocated: " + payment + " to " + votehead.getName());
                votehead.setPaidAmount(votehead.getPaidAmount() + payment);
                remainingPayment -= payment;
                log.debug("   Remaining payment after allocation: " + remainingPayment);

            } else {
                log.debug("   No remaining payment to allocate to  " + votehead.getName());
            }
        }
        // 4. Handle Overpayment if any
        AccountChart overpaymentAccount = null;
        boolean hasOverpayment = false;
        if (remainingPayment > 0) {
            log.info("Remaining payment found {}, processing overpayment",remainingPayment );
            try {
                overpaymentAccount = accountChartService.getDefaultOverpaymentAccount();
                log.debug("Overpayment account fetched: {}", overpaymentAccount);
                hasOverpayment = true;
                final AccountChart finalOverpaymentAccount = overpaymentAccount;
                VoteheadDTO overPaymentLiability =  voteheads.stream()
                        .filter(votehead -> votehead.getName().equals(finalOverpaymentAccount.getName()))
                        .findFirst()
                        .orElse(null);
                if (overPaymentLiability == null && overpaymentAccount != null) {
                    log.debug("Overpayment liability votehead not found creating one for account: {}",overpaymentAccount.getName());
                    VoteheadDTO newOverPaymentLiability = new VoteheadDTO(overpaymentAccount.getName(), remainingPayment, remainingPayment);
                    voteheads.add(newOverPaymentLiability);
                    log.debug("Overpayment liability votehead created: {}", newOverPaymentLiability);
                    overPaymentLiability = newOverPaymentLiability;
                }else if (overPaymentLiability != null) {
                    log.debug("Overpayment liability votehead found, allocating payment: {}", overPaymentLiability.getName());
                    overPaymentLiability.setPaidAmount(overPaymentLiability.getPaidAmount()+remainingPayment);
                    log.debug("Remaining payment allocated to overpayment liability: {}", overPaymentLiability.getPaidAmount());
                }

            }catch (Exception ex){
                //Log exception of no default overpayment account
                log.warn("No default overpayment account has been defined", ex);
            }
        }


        // 5. Print Results
        log.debug("\nPayment Distribution:");
        for (VoteheadDTO votehead : voteheads) {
            log.debug(votehead.toString());
        }
        log.debug("\nRemaining Payment: " + remainingPayment);

        AllocationResultDTO allocationResultDTO = new AllocationResultDTO(voteheads, hasOverpayment, overpaymentAccount);
        log.info("Payment allocation completed, result: {}", allocationResultDTO);
        return allocationResultDTO;


    }
}*/


package com.ctecx.argosfims.tenant.finance;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentAutoMappingService {

    private final CustomFinanceRepository customFinanceRepository;
    private final AccountChartService accountChartService;

    public List<AccountBalanceDTO> getAccountChartBalancesByStudentIdAutomapping(int studentId) {
        log.info("Fetching account chart balances for student ID: {}", studentId);
        List<Map<String, Object>> rawData = customFinanceRepository.GetAccountChartBalancesByStudentId(studentId);
        List<AccountBalanceDTO> accountBalanceDTOS = mapToAccountBalanceDTOList(rawData);
        log.debug("Account chart balances fetched successfully for student ID {}: {}", studentId, accountBalanceDTOS);
        return accountBalanceDTOS;
    }

    private List<AccountBalanceDTO> mapToAccountBalanceDTOList(List<Map<String, Object>> rawData) {
        return rawData.stream()
                .map(this::mapToAccountBalanceDTO)
                .collect(Collectors.toList());
    }

    private AccountBalanceDTO mapToAccountBalanceDTO(Map<String, Object> data) {
        Integer id = (Integer) data.get("id");
        String accountName = (String) data.get("account_name");
        Double balance;
        Object balanceObject = data.get("balance");
        if (balanceObject instanceof Double) {
            balance = (Double) balanceObject;
        } else if (balanceObject instanceof java.math.BigDecimal) {
            balance = ((java.math.BigDecimal) balanceObject).doubleValue();
        } else {
            balance = 0.0;
        }

        // Trim whitespace from accountName
        if (accountName != null) {
            accountName = accountName.trim();
        }
        AccountBalanceDTO accountBalanceDTO = new AccountBalanceDTO(id, accountName, balance);
        log.debug("Account balance mapped : {}", accountBalanceDTO);
        return accountBalanceDTO;
    }


    public AllocationResultDTO allocatePayment(int studentId, double amountPaid) {
        log.info("Starting payment allocation for student ID: {}, with amount paid: {}", studentId, amountPaid);
        List<AccountBalanceDTO> accountBalances = getAccountChartBalancesByStudentIdAutomapping(studentId);

        List<VoteheadDTO> voteheads = accountBalances.stream().map(accountBalanceDTO -> new VoteheadDTO(
                accountBalanceDTO.getAccountName(), accountBalanceDTO.getBalance(), 0
        )).collect(Collectors.toList());
        log.debug("Voteheads initialized: {}", voteheads);

        double remainingPayment = amountPaid;
        log.debug("Initial Remaining Payment: {}", remainingPayment);

        // 3. Prioritize Debtors Allocation
        VoteheadDTO debtorsVotehead = voteheads.stream()
                .filter(votehead -> "Debtors".equalsIgnoreCase(votehead.getName()))
                .findFirst()
                .orElse(null);

        if (debtorsVotehead != null) {
            log.debug("Debtors votehead found, prioritizing allocation.");
            double remainingCost = debtorsVotehead.getInitialCost() - debtorsVotehead.getPaidAmount();
            if (remainingPayment > 0) {
                double payment = Math.min(remainingPayment, remainingCost);
                log.debug("   Payment Allocated: " + payment + " to Debtors");
                debtorsVotehead.setPaidAmount(debtorsVotehead.getPaidAmount() + payment);
                remainingPayment -= payment;
                log.debug("   Remaining payment after debtors allocation: " + remainingPayment);
            }
        } else{
            log.debug("Debtors votehead not found, continuing with the normal allocation");
        }



        // 4. Distribute Payment to other accounts
        if (remainingPayment > 0){
            for (VoteheadDTO votehead : voteheads) {
                // Skip debtors because allocation was done earlier
                if ("Debtors".equalsIgnoreCase(votehead.getName())) {
                    continue;
                }
                log.debug("\nProcessing votehead: " + votehead.getName());
                double remainingCost = votehead.getInitialCost() - votehead.getPaidAmount();
                log.debug("   Remaining cost for " + votehead.getName() + ": " + remainingCost);

                if (remainingPayment > 0) {
                    double payment = Math.min(remainingPayment, remainingCost);
                    log.debug("   Payment Allocated: " + payment + " to " + votehead.getName());
                    votehead.setPaidAmount(votehead.getPaidAmount() + payment);
                    remainingPayment -= payment;
                    log.debug("   Remaining payment after allocation: " + remainingPayment);

                } else {
                    log.debug("   No remaining payment to allocate to  " + votehead.getName());
                }
            }
        }else {
            log.debug("No remaining amount after debtors allocation skipping other allocations");
        }




        // 5. Handle Overpayment if any
        AccountChart overpaymentAccount = null;
        boolean hasOverpayment = false;
        if (remainingPayment > 0) {
            log.info("Remaining payment found {}, processing overpayment",remainingPayment );
            try {
                overpaymentAccount = accountChartService.getDefaultOverpaymentAccount();
                log.debug("Overpayment account fetched: {}", overpaymentAccount);
                hasOverpayment = true;
                final AccountChart finalOverpaymentAccount = overpaymentAccount;
                VoteheadDTO overPaymentLiability =  voteheads.stream()
                        .filter(votehead -> votehead.getName().equals(finalOverpaymentAccount.getName()))
                        .findFirst()
                        .orElse(null);
                if (overPaymentLiability == null && overpaymentAccount != null) {
                    log.debug("Overpayment liability votehead not found creating one for account: {}",overpaymentAccount.getName());
                    VoteheadDTO newOverPaymentLiability = new VoteheadDTO(overpaymentAccount.getName(), remainingPayment, remainingPayment);
                    voteheads.add(newOverPaymentLiability);
                    log.debug("Overpayment liability votehead created: {}", newOverPaymentLiability);
                    overPaymentLiability = newOverPaymentLiability;
                }else if (overPaymentLiability != null) {
                    log.debug("Overpayment liability votehead found, allocating payment: {}", overPaymentLiability.getName());
                    overPaymentLiability.setPaidAmount(overPaymentLiability.getPaidAmount()+remainingPayment);
                    log.debug("Remaining payment allocated to overpayment liability: {}", overPaymentLiability.getPaidAmount());
                }

            }catch (Exception ex){
                //Log exception of no default overpayment account
                log.warn("No default overpayment account has been defined", ex);
            }
        }


        // 6. Print Results
        log.debug("\nPayment Distribution:");
        for (VoteheadDTO votehead : voteheads) {
            log.debug(votehead.toString());
        }
        log.debug("\nRemaining Payment: " + remainingPayment);

        AllocationResultDTO allocationResultDTO = new AllocationResultDTO(voteheads, hasOverpayment, overpaymentAccount);
        log.info("Payment allocation completed, result: {}", allocationResultDTO);
        return allocationResultDTO;
    }
}