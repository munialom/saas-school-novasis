package com.ctecx.argosfims.tenant.transactions;

import com.ctecx.argosfims.tenant.finance.CustomFinanceRepository;
import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.school.CustomSchoolRepository;
import com.ctecx.argosfims.tenant.students.Admission;
import com.ctecx.argosfims.tenant.students.Mode;
import com.ctecx.argosfims.tenant.students.Student;
import com.ctecx.argosfims.tenant.classess.StudentClass;
import com.ctecx.argosfims.tenant.streams.StudentStream;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.CharacterPredicates;
import org.apache.commons.text.RandomStringGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;
    private final CustomFinanceRepository customFinanceRepository;
    private final CustomSchoolRepository schoolRepository;
    private final TransactionTemplate transactionTemplate;
    private static final int BATCH_SIZE = 50; //Adjust the batch Size


    @Transactional
    public List<TransactionResponse> processBulkInvoice(BulkInvoice bulkInvoice) {
        log.info("Received bulk invoice request: {}", bulkInvoice);
        validateBulkInvoice(bulkInvoice);

        List<Student> students = retrieveStudents(bulkInvoice);

        List<List<Student>> studentBatches = splitStudentsIntoBatches(students, BATCH_SIZE);
        List<TransactionResponse> allTransactionResponses = new ArrayList<>();
        studentBatches.forEach(studentBatch -> {
            List<TransactionResponse> transactionResponses =  generateTransactionsAsync(bulkInvoice, studentBatch);
            allTransactionResponses.addAll(transactionResponses);

        });

        log.info("Total transactions created: {}", allTransactionResponses.stream().filter(response -> response.getStatus().equals("CREATED")).count());
        log.info("Total transactions skipped: {}", allTransactionResponses.stream().filter(response -> response.getStatus().equals("SKIPPED")).count());
        return allTransactionResponses;

    }


    private void validateBulkInvoice(BulkInvoice bulkInvoice) {
        if (bulkInvoice == null ||
                bulkInvoice.getTransactionDate() == null ||
                bulkInvoice.getTerm() == null ||
                bulkInvoice.getAccounts() == null ||
                bulkInvoice.getAccounts().isEmpty()) {
            log.error("Invalid bulk invoice data: {}", bulkInvoice);
            throw new IllegalArgumentException("Invalid bulk invoice data.");
        }
    }


    private List<Student> retrieveStudents(BulkInvoice bulkInvoice) {


        log.info("Retrieving students for bulk invoice. Individual Student IDs: {}", bulkInvoice.isIndividualStudentIds());

        if (bulkInvoice.isIndividualStudentIds()) {
            if(bulkInvoice.getStudentIds() == null || bulkInvoice.getStudentIds().isEmpty()){
                log.error("StudentIds are required when individualStudentIds is true.");
                throw new IllegalArgumentException("StudentIds are required when individualStudentIds is true.");
            }
            log.info("Retrieving students by IDs: {}", bulkInvoice.getStudentIds());
            return retrieveStudentsByIds(bulkInvoice.getStudentIds());
        } else {
            if (bulkInvoice.getClassId() <= 0) {
                log.error("ClassId is required when individualStudentIds is false.");
                throw new IllegalArgumentException("ClassId is required when individualStudentIds is false");
            }
            log.info("Retrieving students by class ID: {}", bulkInvoice.getClassId());
            return retrieveStudentsByClass(bulkInvoice.getClassId());
        }
    }

    private List<Student> retrieveStudentsByClass(int classId) {
        log.info("Fetching active students for class ID: {}", classId);
        List<Map<String, Object>> studentData = customFinanceRepository
                .getActiveStudentsByClassAndAdmission(classId, "SESSION");
        if (studentData.isEmpty()) {
            log.error("No students found for class ID: {}", classId);
            throw new EntityNotFoundException("No students found for class: " + classId);
        }
        List<Student> students = studentData.stream().map(this::mapStudent).collect(Collectors.toList());
        log.info("Found {} students for class ID: {}", students.size(), classId);
        return students;

    }


    private List<Student> retrieveStudentsByIds(List<Integer> studentIds) {
        log.info("Fetching students by IDs: {}", studentIds);
        List<Student> students = new ArrayList<>();
        for (Integer studentId : studentIds){
            List<Map<String,Object>> studentData = schoolRepository.getStudentById(studentId);
            if(studentData.isEmpty()){
                log.error("Student with ID {} not found", studentId);
                throw new EntityNotFoundException("Student with Id " + studentId + " not found");
            }
            students.add(mapStudent(studentData.get(0)));
        }
        log.info("Found {} students by IDs: {}", students.size(), studentIds);
        return students;
    }


    @Async
    public List<TransactionResponse> generateTransactionsAsync(BulkInvoice bulkInvoice, List<Student> students) {
        log.info("Generating transactions for {} students asynchronously", students.size());
        List<TransactionResponse> transactionResponses = new ArrayList<>();
        for (Student student : students) {
            for (Account account : bulkInvoice.getAccounts()) {
                BigDecimal amount = account.getAmount();
                if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
                    TransactionResponse response = transactionTemplate.execute(status -> {
                        try {
                            AccountChart accountChart = getAccountChart(account.getId());
                            String term = getTerm(bulkInvoice.getTransactionDate(), bulkInvoice.getTerm());
                            if (!transactionExists(student.getId(), accountChart.getId(), term)) {
                                String transDesc = "Invoicing " + term + " fee to account: " + accountChart.getName() + " Amount of " + account.getAmount();
                                String sn = customFinanceRepository.GenerateTransactionReference();
                                Transaction transaction = createTransaction(student, accountChart, term, account.getAmount(), bulkInvoice.getTransactionDate(), transDesc, sn);
                                transactionRepository.save(transaction);

                                log.debug("Generated and Saved transaction for student {}, account {}: {}", student.getId(), account.getId(), transaction.getId());
                                return new TransactionResponse(student.getId(), account.getId(), "CREATED",  "Transaction created successfully");

                            } else {
                                log.warn("Skipping duplicate transaction for student {}, account {}, term {}.", student.getId(), accountChart.getId(), term);
                                return new TransactionResponse(student.getId(), account.getId(), "SKIPPED", "Duplicate transaction found");
                            }

                        } catch (Exception ex) {
                            log.error("Error processing transaction for student {}, account {}: {}", student.getId(), account.getId(), ex.getMessage(), ex);
                            status.setRollbackOnly();
                            return new TransactionResponse(student.getId(), account.getId(), "ERROR", "Transaction error " + ex.getMessage());
                        }
                    });
                    transactionResponses.add(response);
                } else{
                    log.warn("Skipping transaction for student {}, account {} due to zero amount", student.getId(), account.getId());
                    transactionResponses.add(new TransactionResponse(student.getId(), account.getId(), "SKIPPED", "Transaction skipped due to zero amount"));
                }
            }
        }
        log.info("Generated {} transactions asynchronously.", transactionResponses.size());
        return transactionResponses;
    }


    private AccountChart getAccountChart(int accountId) {
        log.info("Fetching account chart by ID: {}", accountId);
        List<AccountChartTransaction> accountData = customFinanceRepository.GetAccountsChartById(accountId);

        if (accountData == null || accountData.isEmpty()) {
            log.error("Account with ID {} not found.", accountId);
            throw new EntityNotFoundException("Account not found: " + accountId);
        }
        AccountChart accountChart = mapAccountChartResponseToAccountChart(accountData.get(0));
        log.debug("Fetched account chart: {}", accountChart);
        return  accountChart;
    }

    private AccountChart mapAccountChartResponseToAccountChart(AccountChartTransaction response) {
        AccountChart accountChart = new AccountChart();
        accountChart.setId(response.getId());
        accountChart.setAccountCode(response.getAccountCode());
        accountChart.setName(response.getName());
        accountChart.setAccountGroup(response.getAccountGroup());
        accountChart.setParentGroup(response.getParentGroup());
        return accountChart;
    }


    private Transaction createTransaction(Student studentFee, AccountChart accountChart, String term, BigDecimal amount, LocalDate transactionDate, String transDesc, String sn) {
        Transaction transaction = new Transaction();
        transaction.setStudent(studentFee);
        transaction.setAccountChart(accountChart);
        transaction.setTerm(term);
        transaction.setAmount(amount);
        transaction.setTransactionDate(transactionDate);
        transaction.setDescription(transDesc);
        transaction.setSerialNumber(sn);
        transaction.setClassName(studentFee.getStudentClass().getClassName());
        transaction.setAdmission_number(studentFee.getAdmissionNumber());
        transaction.setModule("Fees Allocation");
        transaction.setAccountType(accountChart.getAccountGroup().toString());
        transaction.setAccountName(accountChart.getName());
        transaction.setStreamName(studentFee.getStudentStream().getStreamName());
        transaction.setStudentName(studentFee.getFullName());
        transaction.setMode("System Invoice");
        transaction.setStatus("Active");
        transaction.setStudentClass(studentFee.getStudentClass().getId());
        transaction.setDebit(amount);
        transaction.setCredit(BigDecimal.ZERO);
        transaction.setPartyId(String.valueOf(studentFee.getId()));
        log.debug("Created transaction: {}", transaction);
        return transaction;
    }

    private String getTerm(LocalDate transactionDate, String term) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(java.sql.Date.valueOf(transactionDate));
        int currentYear = calendar.get(Calendar.YEAR);
        return term + "-" + currentYear;
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


    private boolean transactionExists(Long studentId, int accountId, String term) {
        boolean transactionExists = transactionRepository.existsByStudent_IdAndAccountChart_IdAndTerm(studentId, accountId, term);
        log.debug("Transaction exists for student {}, account {}, term {}: {}", studentId, accountId, term, transactionExists);
        return transactionExists;
    }

    public String getTransactionUniqueNumber() {
        RandomStringGenerator random = new RandomStringGenerator
                .Builder()
                .withinRange('0', 'z')
                .filteredBy(CharacterPredicates.LETTERS, CharacterPredicates.DIGITS)
                .build();
        return random.generate(10).toUpperCase();
    }

    private static <T> List<List<T>> splitStudentsIntoBatches(List<T> list, int batchSize) {
        List<List<T>> batches = new ArrayList<>();
        for (int i = 0; i < list.size(); i += batchSize) {
            int end = Math.min(i + batchSize, list.size());
            batches.add(list.subList(i, end));
        }
        return batches;
    }

    // Inner class to represent the transaction processing response
    public static class TransactionResponse {
        private Long studentId;
        private int accountId;
        private String status; // CREATED, SKIPPED, ERROR
        private String message;


        public TransactionResponse(Long studentId, int accountId, String status, String message) {
            this.studentId = studentId;
            this.accountId = accountId;
            this.status = status;
            this.message = message;
        }

        public Long getStudentId() {
            return studentId;
        }

        public int getAccountId() {
            return accountId;
        }

        public String getStatus() {
            return status;
        }
        public String getMessage() {
            return message;
        }
    }
}