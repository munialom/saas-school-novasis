package com.ctecx.argosfims.tenant.finance;

import com.ctecx.argosfims.tenant.transactions.AccountChartTransaction;

import java.util.List;
import java.util.Map;

public interface CustomFinanceRepository {

    List<Map<String, Object>> sp_GetActiveStudentsByClassStreamAndAdmission(int classId, int streamId, String sessionMode);

    String GenerateNextSerialNumber();

    String GenerateTransactionReference();

    List<Map<String, Object>> GetRevenueAccounts();

    List<Map<String, Object>> GetChartOfAccounts();

    List<Map<String, Object>> GetBankAccounts();

    Map<String, Object> deleteChartOfAccountById(int id);

    Map<String, Object> updateChartOfAccount(ChartOfAccountUpdateDTO chartOfAccountUpdateDTO);

    List<Map<String, Object>> getActiveStudentsByClassAndAdmission(int classId, String sessionMode);

    List<AccountChartTransaction> GetAccountsChartById(int id);

    List<Map<String, Object>> GetAccountChartBalancesByStudentId(int studentId);

    List<Map<String, Object>> GetStudentTransactionSummary(int studentId);

    // New Methods for stored procedures
    List<Map<String, Object>> GetTransactionsByStudent(int studentId);

    List<Map<String, Object>> GetInvoicedTransactionsByStudent(int studentId);

    List<Map<String, Object>> GetPaymentTransactionsByStudent(int studentId);

    List<Map<String, Object>> summaryByDate(String startDate, String endDate);

    List<Map<String, Object>> summaryByClass(String startDate, String endDate);

    List<Map<String, Object>> GetPaymentsSummary(String startDate, String endDate);

    // New method for GetBankPaymentTransactionReport
    List<Map<String, Object>> GetBankPaymentTransactionReport(String startDate, String endDate);

    // New Method to call trial balance stored procedure
    List<Map<String, Object>> GetTrialBalance(String startDate, String endDate);
    // New Method to call income statement stored procedure
    List<Map<String, Object>> GetIncomeStatement(String startDate, String endDate);
    // New Method to call cash flow statement stored procedure
    List<Map<String, Object>> GetCashFlowStatement(String startDate, String endDate);
    // New Method to call cash book statement stored procedure
    List<Map<String, Object>> GetCashBook(String startDate, String endDate);

    //New Method to call balance sheet stored procedure
    List<Map<String,Object>> GetBalanceSheet(String asOfDate);

    //New method to call ledger transaction stored procedure
    List<Map<String,Object>> GetLedgerTransactions(String startDate, String endDate, int accountChartId);

    // New Method to get receipt data
    List<Map<String, Object>> generateStudentReceiptBySerialNumber(String serialNumber);
    List<Map<String, Object>> GetPaymentVoucherDetailsByVoucherNumber(String serialNumber);

    // New methods for the new stored procedures
    List<Map<String, Object>> GetPaymentVouchers();
    List<Map<String, Object>> GetSupplierInvoices();
}