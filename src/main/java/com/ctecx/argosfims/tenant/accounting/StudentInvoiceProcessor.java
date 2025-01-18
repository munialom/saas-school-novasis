package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountGroup;
import com.ctecx.argosfims.tenant.config.TenantJdbcTemplateConfig;
import com.ctecx.argosfims.tenant.classess.StudentClass;
import com.ctecx.argosfims.tenant.finance.CustomFinanceRepository;
import com.ctecx.argosfims.tenant.school.CustomSchoolRepository;
import com.ctecx.argosfims.tenant.streams.StudentStream;
import com.ctecx.argosfims.tenant.students.Admission;
import com.ctecx.argosfims.tenant.students.Mode;
import com.ctecx.argosfims.tenant.students.Student;
import com.ctecx.argosfims.tenant.transactions.Account;
import com.ctecx.argosfims.tenant.transactions.BulkInvoice;
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
import java.util.stream.Collectors;

@Slf4j
@Component
@AllArgsConstructor
public class StudentInvoiceProcessor {

    private final CustomFinanceRepository customFinanceRepository;
    private final CustomSchoolRepository schoolRepository;
    private final TenantJdbcTemplateConfig tenantJdbcTemplateConfig;
    private final NonProfitAccountingSystem accountingSystem;


    private static final int BATCH_SIZE = 50;


    // Helper method to get JdbcTemplate
    private JdbcTemplate getJdbcTemplate() {
        return tenantJdbcTemplateConfig.getTenantJdbcTemplate();
    }

    // Main method to process bulk invoices
    public void processBulkInvoice(BulkInvoice bulkInvoice) {
        log.info("Starting bulk invoice processing for class: {}, term: {}, date: {}, individualStudentIds: {}",
                bulkInvoice.getClassId(), bulkInvoice.getTerm(), bulkInvoice.getTransactionDate(), bulkInvoice.isIndividualStudentIds());

        validateBulkInvoice(bulkInvoice);
        List<Student> students = retrieveStudents(bulkInvoice);
        if (students.isEmpty()) {
            log.warn("No students found. Aborting invoice processing.");
            return;
        }
        processStudentInvoices(bulkInvoice, students);

        log.info("Finished bulk invoice processing for class: {}, term: {}",
                bulkInvoice.getClassId(), bulkInvoice.getTerm());
    }

    private void processStudentInvoices(BulkInvoice bulkInvoice, List<Student> students) {
        List<List<Student>> studentBatches = splitStudentsIntoBatches(students, BATCH_SIZE);
        log.debug("Split students into {} batches", studentBatches.size());
        studentBatches.forEach(batch ->{
            log.debug("Processing batch of {} students", batch.size());
            if(bulkInvoice.isIndividualStudentIds()){
                processIndividualStudentInvoices(bulkInvoice, batch);
            }else {
                processAggregateInvoice(bulkInvoice, batch);
            }
        });
    }

    // Helper method to get formatted term with year
    private String getTerm(LocalDate paymentDate, String term) {
        int currentYear = paymentDate.getYear();
        return term + "-" + currentYear;
    }
    // Helper method to retrieve students based on BulkInvoice
    private List<Student> retrieveStudents(BulkInvoice bulkInvoice) {
        log.info("Retrieving students for bulk invoice. Individual Student IDs: {}", bulkInvoice.isIndividualStudentIds());
        return bulkInvoice.isIndividualStudentIds() ? retrieveStudentsByIds(bulkInvoice) : retrieveStudentsByClass(bulkInvoice);
    }


    private List<Student> retrieveStudentsByClass(BulkInvoice bulkInvoice) {
        int classId = bulkInvoice.getClassId();
        log.info("Fetching active students for class ID: {}", classId);
        List<Map<String,Object>> studentData = customFinanceRepository
                .getActiveStudentsByClassAndAdmission(classId, "SESSION");
        if(studentData.isEmpty()){
            log.error("No students found for class ID: {}", classId);
            throw new EntityNotFoundException("No students found for class: " + classId);
        }

        List<Student> students = studentData.stream().map(this::mapStudent).collect(Collectors.toList());
        log.info("Found {} students for class ID: {}", students.size(), classId);
        return students;

    }
    // Helper method to retrieve students by their IDs
    private List<Student> retrieveStudentsByIds(BulkInvoice bulkInvoice) {

        List<Integer> studentIds = bulkInvoice.getStudentIds();
        if(studentIds == null || studentIds.isEmpty()){
            log.error("StudentIds are required when individualStudentIds is true.");
            throw new IllegalArgumentException("StudentIds are required when individualStudentIds is true.");
        }
        log.info("Fetching students by IDs: {}", studentIds);
        List<Student> students = new ArrayList<>();
        for (Integer studentId : studentIds) {
            students.add(retrieveStudentById(studentId));
        }
        log.info("Found {} students by IDs: {}", students.size(), studentIds);
        return students;
    }

    // Helper method to retrieve student by id
    private Student retrieveStudentById(int studentId){
        log.debug("Fetching Student with ID: {}", studentId);
        List<Map<String, Object>> studentData = schoolRepository.getStudentById(studentId);
        if (studentData.isEmpty()) {
            log.error("Student with ID {} not found", studentId);
            throw new EntityNotFoundException("Student with Id " + studentId + " not found");
        }
        Student student =  mapStudent(studentData.get(0));
        log.debug("Student with Id {} retrieved successfully", studentId);
        return student;
    }


    // Helper method to map a database record to a Student object
    private Student mapStudent(Map<String, Object> studentData) {
        log.debug("Mapping student data: {}", studentData);

        Student student = new Student();
        student.setId(((Number) studentData.get("Id")).longValue());
        student.setAdmissionNumber((String) studentData.get("AdmissionNumber"));
        student.setFullName((String) studentData.get("FullName"));
        student.setAdmission(Admission.valueOf((String) studentData.get("Admission")));
        student.setMode(Mode.valueOf((String) studentData.get("Mode")));

        // Map StudentClass
        StudentClass studentClass = new StudentClass();
        studentClass.setId((int) ((Number) studentData.get("ClassId")).longValue());
        studentClass.setClassName(((String) studentData.get("ClassName")).trim());
        student.setStudentClass(studentClass);

        // Map StudentStream
        StudentStream studentStream = new StudentStream();
        studentStream.setId((int) ((Number) studentData.get("StreamId")).longValue());
        studentStream.setStreamName(((String) studentData.get("StreamName")).trim());
        student.setStudentStream(studentStream);

        log.debug("Mapped Student: {}", student);
        return student;
    }

    // Helper method to split a list into batches
    private static <T> List<List<T>> splitStudentsIntoBatches(List<T> list, int batchSize) {
        List<List<T>> batches = new ArrayList<>();
        for (int i = 0; i < list.size(); i += batchSize) {
            int end = Math.min(i + batchSize, list.size());
            batches.add(list.subList(i, end));
        }
        return batches;
    }

    // Helper method to create accounting entries for student
    private List<TransactionHelper.TransactionEntry> createTransactionEntries(List<Account> accounts) {
        List<TransactionHelper.TransactionEntry> items = new ArrayList<>();
        for (Account account : accounts) {
            log.debug("Processing account: {}", account.getAccountName());
            AccountChart receivableAccount = getAccountChart(account.getAccountName().trim(), "receivable");
            AccountChart revenueAccount = getRevenueAccount(receivableAccount.getId());

            // Debit the respective accounts receivable
            items.add(createTransactionEntry(receivableAccount, account.getAmount(), true));
            // Credit the revenue accounts
            items.add(createTransactionEntry(revenueAccount, account.getAmount(), false));
            log.debug("Created accounting entry items for account {}", account.getAccountName());
        }
        return items;
    }
    private TransactionHelper.TransactionEntry createTransactionEntry(AccountChart account, BigDecimal amount, boolean isDebit){
        return new TransactionHelper.TransactionEntry(account, isDebit, amount);
    }
    private void processIndividualStudentInvoices(BulkInvoice bulkInvoice, List<Student> studentBatch) {
        log.info("Processing individual student invoices for batch of {} students", studentBatch.size());
        studentBatch.forEach(student -> processIndividualStudentInvoice(bulkInvoice, student));
        log.info("Finished processing individual student invoices for batch");
    }
    private void processIndividualStudentInvoice(BulkInvoice bulkInvoice, Student student) {
        log.debug("Processing invoice for Student ID: {}", student.getId());
        List<TransactionHelper.TransactionEntry> entries = createTransactionEntries(bulkInvoice.getAccounts());
        String voucherNumber = customFinanceRepository.GenerateTransactionReference();
        List<Transaction> transactions = TransactionHelper.createBalancedTransaction(
                bulkInvoice.getTransactionDate(),
                "Student Invoice for " + bulkInvoice.getTerm(),
                "System Invoice",
                "Fees Allocation",
                entries,
                student.getId().toString()
        );
        if(transactions != null && !transactions.isEmpty()) {
            transactions.forEach(transaction -> {
                transaction.setStudentName(student.getFullName());
                transaction.setMode("System Invoice");
                transaction.setStatus("Active");
                transaction.setStudent(student);
                transaction.setPartyId(student.getId().toString());
                transaction.setStudentClass(student.getStudentClass().getId());
                transaction.setStreamName(student.getStudentStream().getStreamName());
                transaction.setSerialNumber(voucherNumber);
                transaction.setClassName(student.getStudentClass().getClassName());
                transaction.setAdmission_number(student.getAdmissionNumber());

                // Dynamically set the module based on debit/credit
                if (transaction.getTransactionType().equals("Debit")) {
                    transaction.setModule("Fees Allocation");
                } else {
                    transaction.setModule("Revenue Allocation");
                }
            });
            accountingSystem.recordTransactions(transactions);
        }
        log.debug("Finished processing invoice for Student ID: {}", student.getId());
    }


    private void processAggregateInvoice(BulkInvoice bulkInvoice, List<Student> studentBatch) {
        log.info("Processing aggregate invoice for batch of {} students", studentBatch.size());
        String voucherNumber = customFinanceRepository.GenerateTransactionReference();
        String term = getTerm(bulkInvoice.getTransactionDate(), bulkInvoice.getTerm());
        for (Student student : studentBatch) {
            List<TransactionHelper.TransactionEntry> entries = createTransactionEntries(bulkInvoice.getAccounts());
            List<Transaction> transactions = TransactionHelper.createBalancedTransaction(
                    bulkInvoice.getTransactionDate(),
                    "Student Invoice for Class " + bulkInvoice.getClassId() + " Term " + term,
                    "System Invoice",
                    "Fees Allocation",
                    entries,
                    student.getId().toString()
            );
            if (transactions != null && !transactions.isEmpty()) {

                transactions.forEach(transaction -> {
                    transaction.setStudentName(student.getFullName());
                    transaction.setMode("System Invoice");
                    transaction.setStatus("Active");
                    transaction.setStudent(student);
                    transaction.setTerm(term);
                    transaction.setPartyId(student.getId().toString());
                    transaction.setStudentClass(student.getStudentClass().getId());
                    transaction.setStreamName(student.getStudentStream().getStreamName());
                    transaction.setSerialNumber(voucherNumber);
                    transaction.setClassName(student.getStudentClass().getClassName());
                    transaction.setAdmission_number(student.getAdmissionNumber());
                    // Dynamically set the module based on debit/credit
                    if (transaction.getTransactionType().equals("Debit")) {
                        transaction.setModule("Fees Allocation");
                    } else {
                        transaction.setModule("Revenue Allocation");
                    }
                });
                accountingSystem.recordTransactions(transactions);
            }
        }
        log.info("Finished processing aggregate invoice for batch");
    }


    // Helper method to get AccountChart
    private AccountChart getAccountChart(String accountName, String accountType) {
        String sql = "SELECT id, account_name, account_code, account_group_enum, linked_receivable_account_id FROM chartofaccounts WHERE TRIM(account_name) = ?";
        try {
            return getJdbcTemplate().queryForObject(sql, new Object[]{accountName}, (rs, rowNum) -> {
                AccountChart accountChart = new AccountChart();
                accountChart.setId(rs.getInt("id"));
                accountChart.setName(rs.getString("account_name"));
                accountChart.setAccountCode(rs.getInt("account_code"));
                accountChart.setAccountGroupEnum(AccountGroup.valueOf(rs.getString("account_group_enum")));
                return accountChart;
            });
        } catch (EmptyResultDataAccessException e) {
            log.error("{} Account not found with name: {}", accountType, accountName);
            throw new NoSuchElementException(accountType + " Account not found with name: " + accountName);
        }
    }

    // Helper method to get revenue AccountChart
    private AccountChart getRevenueAccount(Integer revenueAccountId) {
        String sql = "SELECT id, account_name, account_code, account_group_enum FROM chartofaccounts WHERE linked_receivable_account_id = ?";
        try {
            return getJdbcTemplate().queryForObject(sql, new Object[]{revenueAccountId}, (rs, rowNum) -> {
                AccountChart accountChart = new AccountChart();
                accountChart.setId(rs.getInt("id"));
                accountChart.setName(rs.getString("account_name").trim());
                accountChart.setAccountCode(rs.getInt("account_code"));
                accountChart.setAccountGroupEnum(AccountGroup.valueOf(rs.getString("account_group_enum")));
                return accountChart;
            });
        } catch (EmptyResultDataAccessException e) {
            log.error("Revenue account not found with ID: {}", revenueAccountId);
            throw new NoSuchElementException("Revenue account not found with ID: " + revenueAccountId);
        }
    }

    // Helper method to validate bulk invoice data
    private void validateBulkInvoice(BulkInvoice bulkInvoice) {
        log.info("Starting bulk invoice validation");
        Objects.requireNonNull(bulkInvoice, "Bulk invoice cannot be null");
        Objects.requireNonNull(bulkInvoice.getTransactionDate(), "Transaction date cannot be null");
        validateString(bulkInvoice.getTerm(), "Term");
        validateClassOrStudentIds(bulkInvoice.getClassId(), bulkInvoice.getStudentIds());
        validateAccounts(bulkInvoice.getAccounts());
        log.info("Bulk invoice validation completed successfully");
    }


    private void validateString(String value, String fieldName){
        if(value == null || value.trim().isEmpty()){
            log.error("{} cannot be null or empty", fieldName);
            throw new IllegalArgumentException(fieldName + " cannot be null or empty");
        }
    }
    private void validateClassOrStudentIds(int classId, List<Integer> studentIds){
        if(classId <= 0 && (studentIds == null || studentIds.isEmpty())){
            log.error("Class ID or Student IDs cannot both be null or empty");
            throw new IllegalArgumentException("Class ID or Student IDs cannot both be null or empty");
        }
    }

    private void validateAccounts(List<Account> accounts) {
        if (accounts == null || accounts.isEmpty()) {
            log.error("Accounts cannot be null or empty");
            throw new IllegalArgumentException("Accounts cannot be null or empty");
        }
        accounts.forEach(this::validateAccount);
    }

    private void validateAccount(Account account) {
        Objects.requireNonNull(account, "Account cannot be null in bulk invoice");
        if (account.getAmount() == null || account.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            log.error("Account amount must be positive in bulk invoice");
            throw new IllegalArgumentException("Account amount must be positive in bulk invoice");
        }
    }
}