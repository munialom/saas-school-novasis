package com.ctecx.argosfims.tenant.finance;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FinanceService {
    private final CustomFinanceRepository customFinanceRepository;

    public List<Map<String, Object>> GetRevenueAccounts() {
        return customFinanceRepository.GetRevenueAccounts();
    }

    public List<Map<String, Object>> GetChartOfAccounts() {
        return customFinanceRepository.GetChartOfAccounts();
    }

    public List<Map<String, Object>> GetBankAccounts() {
        return customFinanceRepository.GetBankAccounts();
    }

    public Map<String, Object> deleteChartOfAccountById(int id) {
        return customFinanceRepository.deleteChartOfAccountById(id);
    }

    public Map<String, Object> updateChartOfAccount(ChartOfAccountUpdateDTO chartOfAccountUpdateDTO) {
        return customFinanceRepository.updateChartOfAccount(chartOfAccountUpdateDTO);
    }

    public List<Map<String, Object>> getActiveStudentsByClassAndAdmission(int classId, String sessionMode) {
        return customFinanceRepository.getActiveStudentsByClassAndAdmission(classId, sessionMode);
    }

    //New Service method
    public List<Map<String, Object>> GetAccountChartBalancesByStudentId(int studentId) {
        return customFinanceRepository.GetAccountChartBalancesByStudentId(studentId);
    }

    public List<Map<String, Object>> GetStudentTransactionSummary(int studentId) {
        return customFinanceRepository.GetStudentTransactionSummary(studentId);
    }

    // New Service methods for stored procedures
    public List<Map<String, Object>> GetTransactionsByStudent(int studentId) {
        return customFinanceRepository.GetTransactionsByStudent(studentId);
    }

    public List<Map<String, Object>> GetInvoicedTransactionsByStudent(int studentId) {
        return customFinanceRepository.GetInvoicedTransactionsByStudent(studentId);
    }

    public List<Map<String, Object>> GetPaymentTransactionsByStudent(int studentId) {
        return customFinanceRepository.GetPaymentTransactionsByStudent(studentId);
    }

    public List<Map<String, Object>> summaryByDate(String startDate, String endDate) {
        return customFinanceRepository.summaryByDate(startDate, endDate);
    }

    public List<Map<String, Object>> summaryByClass(String startDate, String endDate) {
        return customFinanceRepository.summaryByClass(startDate, endDate);
    }

    public List<Map<String, Object>> GetPaymentsSummary(String startDate, String endDate) {
        return customFinanceRepository.GetPaymentsSummary(startDate, endDate);
    }

    //New method for service layer
    public List<Map<String, Object>> GetBankPaymentTransactionReport(String startDate, String endDate) {
        return customFinanceRepository.GetBankPaymentTransactionReport(startDate, endDate);
    }

    //New method for service layer GetTrialBalance
    public List<Map<String, Object>> GetTrialBalance(String startDate, String endDate) {
        return customFinanceRepository.GetTrialBalance(startDate, endDate);
    }
    //New method for service layer GetIncomeStatement
    public List<Map<String, Object>> GetIncomeStatement(String startDate, String endDate) {
        return customFinanceRepository.GetIncomeStatement(startDate, endDate);
    }
    //New method for service layer GetCashFlowStatement
    public List<Map<String, Object>> GetCashFlowStatement(String startDate, String endDate) {
        return customFinanceRepository.GetCashFlowStatement(startDate, endDate);
    }
    //New method for service layer GetCashBook
    public List<Map<String, Object>> GetCashBook(String startDate, String endDate) {
        return customFinanceRepository.GetCashBook(startDate, endDate);
    }
    //New method for service layer GetBalanceSheet
    public List<Map<String, Object>> GetBalanceSheet(String asOfDate) {
        return customFinanceRepository.GetBalanceSheet(asOfDate);
    }
    //New method for service layer GetLedgerTransactions
    public List<Map<String, Object>> GetLedgerTransactions(String startDate, String endDate, int accountChartId) {
        return customFinanceRepository.GetLedgerTransactions(startDate, endDate, accountChartId);
    }

    //New method for service layer sp_GetActiveStudentsByClassStreamAndAdmission
    public List<Map<String, Object>> sp_GetActiveStudentsByClassStreamAndAdmission(int classId, int streamId, String sessionMode) {
        return customFinanceRepository.sp_GetActiveStudentsByClassStreamAndAdmission(classId,streamId, sessionMode);
    }

    // New service method to get the receipt data
    public List<Map<String, Object>> generateStudentReceiptBySerialNumber(String serialNumber) {
        return customFinanceRepository.generateStudentReceiptBySerialNumber(serialNumber);
    }
    public List<Map<String, Object>> GetPaymentVoucherDetailsByVoucherNumber(String serialNumber) {

        return customFinanceRepository.GetPaymentVoucherDetailsByVoucherNumber(serialNumber);
    }

    //New service methods for new stored procedures
    public List<Map<String, Object>> GetPaymentVouchers() {
        return customFinanceRepository.GetPaymentVouchers();
    }

    public List<Map<String, Object>> GetSupplierInvoices() {
        return customFinanceRepository.GetSupplierInvoices();
    }
}