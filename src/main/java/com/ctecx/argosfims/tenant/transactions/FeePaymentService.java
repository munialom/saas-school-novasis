package com.ctecx.argosfims.tenant.transactions;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChart;
import com.ctecx.argosfims.tenant.classess.StudentClass;
import com.ctecx.argosfims.tenant.finance.CustomFinanceRepository;
import com.ctecx.argosfims.tenant.school.CustomSchoolRepository;
import com.ctecx.argosfims.tenant.streams.StudentStream;
import com.ctecx.argosfims.tenant.students.Admission;
import com.ctecx.argosfims.tenant.students.Mode;
import com.ctecx.argosfims.tenant.students.Student;
import com.ctecx.argosfims.tenant.transactions.*;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.text.CharacterPredicates;
import org.apache.commons.text.RandomStringGenerator;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

@Log4j2
@Service
@RequiredArgsConstructor
public class FeePaymentService {

    private final CustomFinanceRepository customFinanceRepository;
    private final CustomSchoolRepository schoolRepository;
    private final TransactionRepository transactionRepository;


    public String saveFees(PaymentRequest paymentRequest) {
        log.info("Received payment request: {}", paymentRequest);

        Student studentData = retrieveStudent(paymentRequest.getStudentId());

        //Fetch bank account details using bankId from PaymentRequest
        AccountChartTransaction bankAccountChartTransaction = getAccountChartTransaction(paymentRequest.getBankId());
        AccountChart bankAccountChart = mapAccountChartResponseToAccountChart(bankAccountChartTransaction);


        String term = getTerm(paymentRequest.getPaymentDate(), paymentRequest.getTerm());
        String sn = customFinanceRepository.GenerateNextSerialNumber();

        paymentRequest.getStudentFeePaymentRequests().forEach(feeRequest -> {
            AccountChartTransaction accountChartTransaction = getAccountChartTransaction(feeRequest.getAccountId());
            AccountChart accountChart = mapAccountChartResponseToAccountChart(accountChartTransaction);

            Transaction transaction = createTransaction(studentData, accountChart, term, feeRequest.getAmount(),
                    paymentRequest.getPaymentDate(), paymentRequest.getPayMode(), paymentRequest.getRef(),
                    sn, paymentRequest.getBankingDate(),bankAccountChart,accountChartTransaction);

            transactionRepository.save(transaction);
        });

        return sn;
    }

    private String getTerm(LocalDate paymentDate, String term) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(java.sql.Date.valueOf(paymentDate));
        int currentYear = calendar.get(Calendar.YEAR);
        return term + "-" + currentYear;
    }

    private AccountChartTransaction getAccountChartTransaction(int accountId) {
        log.info("Fetching account chart by ID: {}", accountId);
        List<AccountChartTransaction> accountData = customFinanceRepository.GetAccountsChartById(accountId);

        if (accountData == null || accountData.isEmpty()) {
            log.error("Account with ID {} not found.", accountId);
            throw new EntityNotFoundException("Account not found: " + accountId);
        }
        log.debug("Fetched account chart transaction: {}", accountData.get(0));
        return accountData.get(0);
    }


    private AccountChart mapAccountChartResponseToAccountChart(AccountChartTransaction response) {
        AccountChart accountChart = new AccountChart();
        accountChart.setId(response.getId());
        accountChart.setAccountCode(response.getAccountCode());
        accountChart.setName(response.getName());
        accountChart.setAccountGroup(response.getAccountGroup());
        accountChart.setParentGroup(response.getParentGroup());
        accountChart.setBankAccount(response.isBankAccount());
        return accountChart;
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


    private Transaction createTransaction(Student student, AccountChart accountChart, String term,
                                          double amount, LocalDate paymentDate, String payMode, String paymentRef,
                                          String sn, LocalDate bankingDate, AccountChart bankAccountChart,AccountChartTransaction accountChartTransaction) {
        Transaction transaction = new Transaction();
        transaction.setStudent(student);
        transaction.setAccountChart(accountChart);
        transaction.setTerm(term);
        transaction.setAmount(BigDecimal.valueOf(amount));
        transaction.setTransactionDate(paymentDate);
        transaction.setBankingDate(bankingDate);
        String transDesc = "" + term + " Payment Received of " + amount + " For Account" + accountChart.getName();
        transaction.setDescription(transDesc);
        transaction.setSerialNumber(sn);
        transaction.setClassName(student.getStudentClass().getClassName());
        transaction.setAdmission_number(student.getAdmissionNumber());
        transaction.setModule("Payments");
        transaction.setAccountType(accountChart.getAccountGroup().toString());
        transaction.setAccountName(accountChart.getName());
        transaction.setStreamName(student.getStudentStream().getStreamName());
        transaction.setStudentName(student.getFullName());
        transaction.setMode(payMode);
        transaction.setPaymentRef(paymentRef);
        if (bankAccountChart.isBankAccount()) {
            transaction.setBankName(bankAccountChart.getName()); // Use account name as bank name
        }


        transaction.setStatus("Active");
        transaction.setStudentClass(student.getStudentClass().getId());
        transaction.setCredit(BigDecimal.valueOf(amount));
        transaction.setDebit(BigDecimal.ZERO);
        transaction.setPartyId(student.getId().toString());

        log.debug("Created transaction: {}", transaction);
        return transaction;
    }



    public String generateSerialNumber() {
        RandomStringGenerator random = new RandomStringGenerator
                .Builder()
                .withinRange('0', 'z')
                .filteredBy(CharacterPredicates.LETTERS, CharacterPredicates.DIGITS)
                .build();
        return random.generate(10).toUpperCase();
    }
}