package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountGroup;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountChartService;
import com.ctecx.argosfims.tenant.config.TenantJdbcTemplateConfig;
import com.ctecx.argosfims.tenant.classess.StudentClass;
import com.ctecx.argosfims.tenant.finance.CustomFinanceRepository;
import com.ctecx.argosfims.tenant.school.CustomSchoolRepository;
import com.ctecx.argosfims.tenant.streams.StudentStream;
import com.ctecx.argosfims.tenant.students.Admission;
import com.ctecx.argosfims.tenant.students.Mode;
import com.ctecx.argosfims.tenant.students.Student;
import com.ctecx.argosfims.tenant.transactions.PaymentRequest;
import com.ctecx.argosfims.tenant.transactions.StudentFeePaymentRequest;
import com.ctecx.argosfims.tenant.transactions.Transaction;
import com.ctecx.argosfims.tenant.utils.TransactionHelper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Component
@AllArgsConstructor
public class StudentPaymentProcessor {

    private final CustomFinanceRepository customFinanceRepository;
    private final CustomSchoolRepository schoolRepository;
    private final TenantJdbcTemplateConfig tenantJdbcTemplateConfig;
    private final NonProfitAccountingSystem accountingSystem;

    // Helper method to get JdbcTemplate
    private JdbcTemplate getJdbcTemplate() {
        return tenantJdbcTemplateConfig.getTenantJdbcTemplate();
    }


    public void processStudentPayment(PaymentRequest paymentRequest) {
        log.info("Processing student payment for student: {}, payment date: {}, banking date: {}, ref: {}",
                paymentRequest.getStudentId(), paymentRequest.getPaymentDate(), paymentRequest.getBankingDate(), paymentRequest.getRef());
        validatePaymentRequest(paymentRequest);
        processPayment(paymentRequest);
        log.info("Finished processing student payment for student: {}, payment date: {}, banking date: {}, ref: {}",
                paymentRequest.getStudentId(), paymentRequest.getPaymentDate(), paymentRequest.getBankingDate(), paymentRequest.getRef());

    }

    private void processPayment(PaymentRequest paymentRequest) {
        log.debug("Starting payment processing for student ID: {}", paymentRequest.getStudentId());
        List<TransactionHelper.TransactionEntry> entries = new ArrayList<>();
        Student student = retrieveStudent(paymentRequest.getStudentId());
        String voucherNumber = customFinanceRepository.GenerateNextSerialNumber();
        AccountChart bankAccount;
        try{
            bankAccount = getBankAccount(paymentRequest.getBankId());
            log.debug("Retrieved bank account: {}", bankAccount);
        }catch (Exception ex){
            log.error("Error getting bank account with id: {}, error: {}", paymentRequest.getBankId(), ex.getMessage(), ex);
            throw ex;
        }

        for (StudentFeePaymentRequest payment : paymentRequest.getStudentFeePaymentRequests()) {
            log.debug("Processing payment for account: {}", payment.getAccountName());

            // Debit Bank account
            entries.add(createTransactionEntry(bankAccount, BigDecimal.valueOf(payment.getAmount()), true));
            log.debug("Debit entry created for bank account: {}", bankAccount.getName());


            // Credit the Account Receivable
            AccountChart receivableAccount = null;
            try {
                receivableAccount = getAccountChart(payment.getAccountName().trim(),"receivable");
                log.debug("Retrieved receivable account: {}", receivableAccount);
            }catch (Exception ex){
                log.error("Error getting receivable account with name {}, error: {}",payment.getAccountName(), ex.getMessage(), ex);
                throw ex;
            }
            entries.add(createTransactionEntry(receivableAccount, BigDecimal.valueOf(payment.getAmount()), false));
            log.debug("Credit entry created for account: {}", receivableAccount.getName());
            log.debug("Finished processing payment for account: {}", payment.getAccountName());
        }

        String term = getTerm(paymentRequest.getPaymentDate(), paymentRequest.getTerm());
        log.debug("Recording entry for student ID: {}", paymentRequest.getStudentId());
        try {
            List<Transaction> transactions = TransactionHelper.createBalancedTransaction(
                    paymentRequest.getPaymentDate(),
                    "Student Payment for " + term + ", Ref: " + paymentRequest.getRef(),
                    paymentRequest.getPayMode(),
                    "Student Payment",
                    entries,
                     paymentRequest.getStudentId().toString()
            );
            if(transactions != null && !transactions.isEmpty()){
                transactions.forEach(transaction -> {
                    transaction.setStudentName(student.getFullName());
                    transaction.setMode(paymentRequest.getPayMode());
                    transaction.setStatus("Active");
                    transaction.setStudent(student);
                    transaction.setTerm(term);
                    transaction.setBankName(bankAccount.getName());
                    transaction.setPartyId(String.valueOf(student.getId()));
                    transaction.setPaymentRef(paymentRequest.getRef());
                    transaction.setBankingDate(paymentRequest.getBankingDate());
                    transaction.setStudentClass(student.getStudentClass().getId());
                    transaction.setStreamName(student.getStudentStream().getStreamName());
                    if (transaction.getTransactionType().equals("Credit")) {
                        transaction.setModule("Payments");
                    } else {
                        transaction.setModule("Student Payments");
                    }
                    transaction.setSerialNumber(voucherNumber);
                    transaction.setClassName(student.getStudentClass().getClassName());
                    transaction.setAdmission_number(student.getAdmissionNumber());
                });
                accountingSystem.recordTransactions(transactions);
            }
            log.debug("Entry recorded successfully for student ID: {}", paymentRequest.getStudentId());
        } catch (Exception ex){
            log.error("Error recording entry for student ID {}, error: {}", paymentRequest.getStudentId(), ex.getMessage(), ex);
            throw ex;
        }

        log.debug("Finished payment processing for student ID: {}", paymentRequest.getStudentId());
    }
    private String getTerm(LocalDate paymentDate, String term) {
        int currentYear = paymentDate.getYear();
        return term + "-" + currentYear;
    }
    private TransactionHelper.TransactionEntry createTransactionEntry(AccountChart account, BigDecimal amount, boolean isDebit){
        return new TransactionHelper.TransactionEntry(account, isDebit, amount);
    }
    private AccountChart getBankAccount(Integer bankId) {
        String sql = "SELECT id, account_name, account_code, account_group_enum, linked_receivable_account_id, is_bank_account FROM chartofaccounts WHERE id = ?";
        try {
            return getJdbcTemplate().queryForObject(sql, new Object[]{bankId}, (rs, rowNum) -> {
                AccountChart accountChart = new AccountChart();
                accountChart.setId(rs.getInt("id"));
                accountChart.setName(rs.getString("account_name"));
                accountChart.setAccountCode(rs.getInt("account_code"));
                accountChart.setAccountGroupEnum(AccountGroup.valueOf(rs.getString("account_group_enum")));
                accountChart.setBankAccount(rs.getBoolean("is_bank_account"));
                return accountChart;
            });
        } catch (EmptyResultDataAccessException e) {
            log.error("Bank Account not found with ID: {}", bankId);
            throw new NoSuchElementException("Bank Account not found with ID: " + bankId);
        }
    }

    private AccountChart getAccountChart(String accountName, String accountType) {
        String sql = "SELECT id, account_name, account_code, account_group_enum, linked_receivable_account_id, is_bank_account FROM chartofaccounts WHERE TRIM(account_name) = ?";
        try {
            return getJdbcTemplate().queryForObject(sql, new Object[]{accountName}, (rs, rowNum) -> {
                AccountChart accountChart = new AccountChart();
                accountChart.setId(rs.getInt("id"));
                accountChart.setName(rs.getString("account_name"));
                accountChart.setAccountCode(rs.getInt("account_code"));
                accountChart.setAccountGroupEnum(AccountGroup.valueOf(rs.getString("account_group_enum")));
                accountChart.setBankAccount(rs.getBoolean("is_bank_account"));
                return accountChart;
            });
        } catch (EmptyResultDataAccessException e) {
            log.error("{} Account not found with name: {}", accountType, accountName);
            throw new NoSuchElementException(accountType + " Account not found with name: " + accountName);
        }
    }



    private Student retrieveStudent(int studentId) {
        log.info("Fetching student by ID: {}", studentId);
        List<Map<String, Object>> studentData = schoolRepository.getStudentById(studentId);
        if (studentData.isEmpty()) {
            log.error("Student with ID {} not found", studentId);
            throw new EntityNotFoundException("Student with Id " + studentId + " not found");
        }
        return mapStudent(studentData.get(0));
    }

    private Student mapStudent(Map<String, Object> studentData) {
        log.debug("Mapping student data: {}", studentData);

        Student student = new Student();
        student.setId(((Number) studentData.get("Id")).longValue());
        student.setAdmissionNumber((String) studentData.get("AdmissionNumber"));
        student.setFullName((String) studentData.get("FullName"));
        student.setAdmission(Admission.valueOf((String) studentData.get("Admission")));
        student.setMode(Mode.valueOf((String) studentData.get("Mode")));
        StudentClass studentClass = new StudentClass();
        studentClass.setId((int) ((Number) studentData.get("ClassId")).longValue());
        studentClass.setClassName((String) studentData.get("ClassName"));
        student.setStudentClass(studentClass);

        StudentStream studentStream = new StudentStream();
        studentStream.setId((int) ((Number) studentData.get("StreamId")).longValue());
        studentStream.setStreamName((String) studentData.get("StreamName"));
        student.setStudentStream(studentStream);

        log.debug("Mapped Student: {}", student);
        return student;
    }


    private void validatePaymentRequest(PaymentRequest paymentRequest) {
        log.info("Starting payment request validation");
        if (paymentRequest == null) {
            log.error("Payment request cannot be null");
            throw new IllegalArgumentException("Payment request cannot be null");
        }
        if (paymentRequest.getPaymentDate() == null) {
            log.error("Payment date cannot be null");
            throw new IllegalArgumentException("Payment date cannot be null");
        }
        if (paymentRequest.getBankingDate() == null) {
            log.error("Banking date cannot be null");
            throw new IllegalArgumentException("Banking date cannot be null");
        }
        if (paymentRequest.getPayMode() == null || paymentRequest.getPayMode().trim().isEmpty()) {
            log.error("Payment mode cannot be null or empty");
            throw new IllegalArgumentException("Payment mode cannot be null or empty");
        }
        if (paymentRequest.getStudentId() == null) {
            log.error("Student ID cannot be null");
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (paymentRequest.getBankId() == null) {
            log.error("Bank ID cannot be null");
            throw new IllegalArgumentException("Bank ID cannot be null");
        }
        if (paymentRequest.getStudentFeePaymentRequests() == null || paymentRequest.getStudentFeePaymentRequests().isEmpty()) {
            log.error("Student Fee Payment Requests cannot be null or empty");
            throw new IllegalArgumentException("Student Fee Payment Requests cannot be null or empty");
        }
        for (StudentFeePaymentRequest request : paymentRequest.getStudentFeePaymentRequests()) {
            if (request == null) {
                log.error("Student Fee Payment Request cannot be null");
                throw new IllegalArgumentException("Student Fee Payment Request cannot be null");
            }
            if (request.getAccountName() == null || request.getAccountName().trim().isEmpty()) {
                log.error("Student Fee Account name cannot be null or empty");
                throw new IllegalArgumentException("Student Fee Account name cannot be null or empty");
            }
            if (request.getAmount() <= 0) {
                log.error("Student Fee payment amount must be positive");
                throw new IllegalArgumentException("Student Fee payment amount must be positive");
            }
        }
        log.info("Payment request validation completed successfully");

    }

}