package com.ctecx.argosfims.tenant.finance;

import com.ctecx.argosfims.tenant.chartofaccounts.AccountChartResponse;
import com.ctecx.argosfims.tenant.config.TenantJdbcTemplateConfig;
import com.ctecx.argosfims.tenant.transactions.AccountChartTransaction;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.sql.Types;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class CustomFinanceRepositoryImpl implements CustomFinanceRepository {

    private final TenantJdbcTemplateConfig tenantJdbcTemplateConfig;

    private JdbcTemplate getJdbcTemplate() {
        return tenantJdbcTemplateConfig.getTenantJdbcTemplate();
    }

    @Override
    public List<Map<String, Object>> sp_GetActiveStudentsByClassStreamAndAdmission(int classId, int streamId, String sessionMode) {
        return getJdbcTemplate().queryForList("CALL sp_GetActiveStudentsByClassStreamAndAdmission(?, ?,?)", classId,streamId, sessionMode);
    }

    //nextTransactionRef //nextSerialNumber
    @Override
    public String GenerateNextSerialNumber() {
        return getJdbcTemplate().queryForObject(
                "CALL GenerateNextSerialNumber()",
                (rs, rowNum) -> rs.getString("nextSerialNumber")
        );
    }

    @Override
    public String GenerateTransactionReference() {
        return getJdbcTemplate().queryForObject(
                "CALL GenerateTransactionReference()",
                (rs, rowNum) -> rs.getString("nextTransactionRef")
        );
    }

    @Override
    public List<Map<String, Object>> GetRevenueAccounts() {
        return getJdbcTemplate().queryForList("CALL GetRevenueAccounts()");
    }

    @Override
    public List<Map<String, Object>> GetChartOfAccounts() {
        return getJdbcTemplate().queryForList("CALL GetChartOfAccounts()");
    }

    @Override
    public List<Map<String, Object>> GetBankAccounts() {
        return getJdbcTemplate().queryForList("CALL GetBankAccounts()");
    }

    @Override
    public Map<String, Object> deleteChartOfAccountById(int id) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withProcedureName("DeleteChartOfAccountById")
                .declareParameters(
                        new SqlParameter("accountId", Types.INTEGER),
                        new SqlOutParameter("Message", Types.VARCHAR)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("accountId", id);

        return simpleJdbcCall.execute(inParams);
    }

    @Override
    public Map<String, Object> updateChartOfAccount(ChartOfAccountUpdateDTO chartOfAccountUpdateDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withProcedureName("UpdateChartOfAccount")
                .declareParameters(
                        new SqlParameter("accountId", Types.INTEGER),
                        new SqlParameter("newAccountName", Types.VARCHAR),
                        new SqlParameter("isBankAccount", Types.BIT),
                        new SqlParameter("accountStatus", Types.BIT),
                        new SqlOutParameter("Message", Types.VARCHAR)
                );
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("accountId", chartOfAccountUpdateDTO.getId());
        inParams.put("newAccountName", chartOfAccountUpdateDTO.getAccountName());
        inParams.put("isBankAccount", chartOfAccountUpdateDTO.isBankAccount());
        inParams.put("accountStatus", chartOfAccountUpdateDTO.isAccountStatus());

        return simpleJdbcCall.execute(inParams);
    }

    @Override
    public List<Map<String, Object>> getActiveStudentsByClassAndAdmission(int classId, String sessionMode) {
        return getJdbcTemplate().queryForList("CALL sp_GetActiveStudentsByClassAndAdmission(?, ?)", classId, sessionMode);
    }

    //New Implementation
    @Override
    public List<AccountChartTransaction> GetAccountsChartById(int id) {
        return getJdbcTemplate().query(
                "CALL GetAccountsChartById(?)",
                new Object[]{id},
                (rs, rowNum) -> {
                    AccountChartTransaction accountChartResponse = new AccountChartTransaction();
                    accountChartResponse.setId(rs.getInt("id"));
                    accountChartResponse.setAccountCode(rs.getInt("AccountCode"));
                    accountChartResponse.setName(rs.getString("AccountName"));
                    accountChartResponse.setAccountGroup(rs.getString("AccountGroup"));
                    accountChartResponse.setParentGroup(rs.getString("ParentGroup"));

                    // Get the "IsBankAccount" string and convert to boolean
                    String isBankAccountStr = rs.getString("IsBankAccount");

                    boolean isBankAccount = false;
                    if (isBankAccountStr != null) {
                        if(isBankAccountStr.equalsIgnoreCase("Yes")){
                            isBankAccount = true;
                        }
                    }
                    accountChartResponse.setBankAccount(isBankAccount);
                    return accountChartResponse;
                }
        );
    }

    @Override
    public List<Map<String, Object>> GetAccountChartBalancesByStudentId(int studentId) {
        return getJdbcTemplate().queryForList("CALL GetAccountChartBalancesByStudentId(?)", studentId);
    }

    @Override
    public List<Map<String, Object>> GetStudentTransactionSummary(int studentId) {
        return getJdbcTemplate().queryForList("CALL GetStudentTransactionSummary(?)", studentId);
    }


    // Implementation for new stored procedures
    @Override
    public List<Map<String, Object>> GetTransactionsByStudent(int studentId) {
        return getJdbcTemplate().queryForList("CALL GetTransactionsByStudent(?)", studentId);
    }

    @Override
    public List<Map<String, Object>> GetInvoicedTransactionsByStudent(int studentId) {
        return getJdbcTemplate().queryForList("CALL GetInvoicedTransactionsByStudent(?)", studentId);
    }

    @Override
    public List<Map<String, Object>> GetPaymentTransactionsByStudent(int studentId) {
        return getJdbcTemplate().queryForList("CALL GetPaymentTransactionsByStudent(?)", studentId);
    }

    @Override
    public List<Map<String, Object>> summaryByDate(String startDate, String endDate) {
        return getJdbcTemplate().queryForList("CALL summaryByDate(?,?)", startDate,endDate);
    }

    @Override
    public List<Map<String, Object>> summaryByClass(String startDate, String endDate) {
        return getJdbcTemplate().queryForList("CALL summaryByClass(?,?)", startDate,endDate);
    }

    @Override
    public List<Map<String, Object>> GetPaymentsSummary(String startDate, String endDate) {
        return  getJdbcTemplate().queryForList("CALL GetPaymentsSummary(?,?)", startDate,endDate);
    }

    // New Implementation for GetBankPaymentTransactionReport
    @Override
    public List<Map<String, Object>> GetBankPaymentTransactionReport(String startDate, String endDate) {
        return getJdbcTemplate().queryForList("CALL GetBankPaymentTransactionReport(?, ?)", startDate, endDate);
    }
    // Implementation for GetTrialBalance
    @Override
    public List<Map<String, Object>> GetTrialBalance(String startDate, String endDate) {
        return getJdbcTemplate().queryForList("CALL GetTrialBalance(?, ?)", startDate, endDate);
    }
    // Implementation for GetIncomeStatement
    @Override
    public List<Map<String, Object>> GetIncomeStatement(String startDate, String endDate) {
        return getJdbcTemplate().queryForList("CALL GetIncomeStatement(?, ?)", startDate, endDate);
    }
    // Implementation for GetCashFlowStatement
    @Override
    public List<Map<String, Object>> GetCashFlowStatement(String startDate, String endDate) {
        return getJdbcTemplate().queryForList("CALL GetCashFlowStatement(?, ?)", startDate, endDate);
    }
    // Implementation for GetCashBook
    @Override
    public List<Map<String, Object>> GetCashBook(String startDate, String endDate) {
        return getJdbcTemplate().queryForList("CALL GetCashBook(?, ?)", startDate, endDate);
    }
    // Implementation for GetBalanceSheet
    @Override
    public List<Map<String, Object>> GetBalanceSheet(String asOfDate) {
        return getJdbcTemplate().queryForList("CALL GetBalanceSheet(?)", asOfDate);
    }

    // Implementation for GetLedgerTransactions
    @Override
    public List<Map<String, Object>> GetLedgerTransactions(String startDate, String endDate, int accountChartId) {
        return getJdbcTemplate().queryForList("CALL GetLedgerTransactions(?, ?, ?)", startDate, endDate, accountChartId);
    }

    @Override
    public List<Map<String, Object>> generateStudentReceiptBySerialNumber(String serialNumber) {
        return getJdbcTemplate().queryForList("CALL GenerateStudentReceiptBySerialNumber(?)", serialNumber);
    }

    @Override
    public List<Map<String, Object>> GetPaymentVoucherDetailsByVoucherNumber(String serialNumber) {

        return getJdbcTemplate().queryForList("CALL GetPaymentVoucherDetailsByVoucherNumber(?)", serialNumber);
    }

    // New Implementations for the new Stored Procedures
    @Override
    public List<Map<String, Object>> GetPaymentVouchers() {
        return getJdbcTemplate().queryForList("CALL GetPaymentVouchers()");
    }

    @Override
    public List<Map<String, Object>> GetSupplierInvoices() {
        return getJdbcTemplate().queryForList("CALL GetSupplierInvoices()");
    }
}