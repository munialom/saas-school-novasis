package com.ctecx.argosfims.tenant.chartofaccounts;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class AccountChartService {

    @Autowired
    private AccountChartRepository accountChartRepository;

    @Transactional
    public String createAccountChart(AccountChartRequest request) {
        if (accountChartRepository.existsByName(request.getName())) {
            throw new RuntimeException("Account with name " + request.getName() + " already exists");
        }

        AccountChart accountChart = mapRequestToEntity(request);
        accountChart.setAccountCode(generateAccountCode(request.getAccountGroup()));
        accountChartRepository.save(accountChart);
        return "Account chart created successfully!";
    }

    public List<AccountChart> getAllAccounts() {
        List<AccountChart> allAccounts = accountChartRepository.findAll();
        return allAccounts.stream()
                .map(account -> {
                    if (account.getParent() == null) {
                        account.setAlias(account.getAlias() + " (Parent Account)");
                    }
                    return account;
                })
                .collect(Collectors.toList());
    }

    private int generateAccountCode(AccountGroup accountGroup) {
        Integer highestCode = accountChartRepository.findHighestCodeByAccountGroup(accountGroup);
        int defaultCode = AccountCodeGenerator.getDefaultCode(accountGroup);

        if (highestCode == null) {
            return defaultCode + 1;
        }
        return highestCode + 1;
    }

    @Transactional
    public String updateAccountChart(AccountChart request) {
        AccountChart accountChart = accountChartRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (accountChartRepository.existsByName(request.getName()) && !accountChart.getName().equals(request.getName())) {
            throw new RuntimeException("Account with name " + request.getName() + " already exists");
        }
        AccountChart updatedAccount = mapRequestToUpdateEntity(request, accountChart);
        accountChartRepository.save(updatedAccount);
        return "Account chart updated successfully!";
    }

    private AccountChart mapRequestToUpdateEntity(AccountChart request, AccountChart existingAccount) {
        existingAccount.setName(request.getName());
        existingAccount.setAlias(request.getAlias());
        existingAccount.setBankAccount(request.isBankAccount());
        existingAccount.setReceivable(request.isReceivable());
        existingAccount.setPayable(request.isPayable());

        if (request.getParent() != null) {
            AccountChart parent = accountChartRepository.findById(request.getParent().getId())
                    .orElseThrow(() -> new RuntimeException("Parent account not found"));
            existingAccount.setParent(parent);
        }

        if (request.getLinkedBankAccount() != null) {
            if (request.isBankAccount()) {
                throw new RuntimeException("Bank accounts should not be linked to bank accounts");
            }
            AccountChart linkedBankAccount = accountChartRepository.findById(request.getLinkedBankAccount().getId())
                    .orElseThrow(() -> new RuntimeException("Linked bank account not found"));
            if (!linkedBankAccount.isBankAccount()) {
                throw new RuntimeException("Linked account is not a bank account");
            }
            existingAccount.setLinkedBankAccount(linkedBankAccount);
        }

        if (request.getReceivableAccount() != null) {
            if (request.isBankAccount()) {
                throw new RuntimeException("Bank accounts cannot be linked to receivable accounts.");
            }
            AccountChart receivableAccount = accountChartRepository.findById(request.getReceivableAccount().getId())
                    .orElseThrow(() -> new RuntimeException("Receivable account not found"));

            existingAccount.setReceivableAccount(receivableAccount);
        }
        return existingAccount;
    }


    private AccountChart mapRequestToEntity(AccountChartRequest request) {
        AccountChart accountChart = new AccountChart();
        accountChart.setName(request.getName());
        accountChart.setAlias(request.getAlias());
        accountChart.setAccountGroupEnum(request.getAccountGroup());
        accountChart.setAccountGroup(request.getAccountGroup().getDisplayText());
        accountChart.setParentGroup(request.getAccountGroup().getParentGroup());
        accountChart.setBankAccount(request.isBankAccount());
        accountChart.setReceivable(request.isReceivable());
        accountChart.setPayable(request.isPayable());

        accountChart.setStatus(true);


        if (request.getParentId() != null) {
            AccountChart parent = accountChartRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent account not found"));
            accountChart.setParent(parent);
        }

        if (request.getLinkedBankAccountId() != null) {
            if (request.isBankAccount()) {
                throw new RuntimeException("Bank accounts should not be linked to bank accounts");
            }
            AccountChart linkedBankAccount = accountChartRepository.findById(request.getLinkedBankAccountId())
                    .orElseThrow(() -> new RuntimeException("Linked bank account not found"));
            if (!linkedBankAccount.isBankAccount()) {
                throw new RuntimeException("Linked account is not a bank account");
            }
            accountChart.setLinkedBankAccount(linkedBankAccount);
        }

        if (request.getReceivableAccountId() != null) {
            if (request.isBankAccount()) {
                throw new RuntimeException("Bank accounts cannot be linked to receivable accounts.");
            }
            AccountChart receivableAccount = accountChartRepository.findById(request.getReceivableAccountId())
                    .orElseThrow(() -> new RuntimeException("Receivable account not found"));

            accountChart.setReceivableAccount(receivableAccount);
        }
        return accountChart;
    }


    public AccountChart getAccountByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Account name cannot be null or empty");
        }
        return accountChartRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Account not found with name: " + name.trim()));
    }


    public AccountChart getReceivableAccount(AccountChart revenueAccount) {
        if (revenueAccount.getReceivableAccount() == null) {
            throw new NoSuchElementException("No receivable account linked for " + revenueAccount.getName());
        }
        return revenueAccount.getReceivableAccount();
    }


    public AccountChart getBankAccount(Integer bankId) {
        return accountChartRepository.findById(bankId)
                .orElseThrow(() -> new NoSuchElementException("Bank Account not found for ID" + bankId));
    }


    public Map<String, List<AccountChart>> getGroupedAccounts() {
        List<AccountChart> allAccounts = accountChartRepository.findAll();

        return allAccounts.stream().collect(Collectors.groupingBy(AccountChart::getParentGroup));
    }
}