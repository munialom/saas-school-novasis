package com.ctecx.argosfims.tenant.finance;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @GetMapping("/accounts")
    public ResponseEntity<List<Map<String, Object>>> getAllChartOfAccounts() {
        return ResponseEntity.ok(financeService.GetChartOfAccounts());
    }

    @GetMapping("/revenue-accounts")
    public ResponseEntity<List<Map<String, Object>>> getAllRevenueAccounts() {
        return ResponseEntity.ok(financeService.GetRevenueAccounts());
    }

    @GetMapping("/bank-accounts")
    public ResponseEntity<List<Map<String, Object>>> getAllBankAccounts() {
        return ResponseEntity.ok(financeService.GetBankAccounts());
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<Map<String, Object>> deleteChartOfAccountById(@PathVariable int id) {
        return ResponseEntity.ok(financeService.deleteChartOfAccountById(id));
    }

    @PutMapping("/accounts")
    public ResponseEntity<Map<String, Object>> updateChartOfAccount(@RequestBody ChartOfAccountUpdateDTO chartOfAccountUpdateDTO) {
        return ResponseEntity.ok(financeService.updateChartOfAccount(chartOfAccountUpdateDTO));
    }

    //New Controller endpoint to get account chart balances by student id
    @GetMapping("/accounts/student/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getAccountChartBalancesByStudentId(@PathVariable int studentId) {
        return ResponseEntity.ok(financeService.GetAccountChartBalancesByStudentId(studentId));
    }

    @GetMapping("/students/{classId}/{sessionMode}")
    public ResponseEntity<List<Map<String, Object>>> getActiveStudentsByClassAndAdmission(
            @PathVariable int classId, @PathVariable String sessionMode) {
        return ResponseEntity.ok(financeService.getActiveStudentsByClassAndAdmission(classId, sessionMode));
    }
    // New Endpoint for GetStudentTransactionSummary
    @GetMapping("/student-transactions/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentTransactionSummary(@PathVariable int studentId) {
        return ResponseEntity.ok(financeService.GetStudentTransactionSummary(studentId));
    }

    // New Endpoints for stored procedures
    @GetMapping("/transactions/student/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getTransactionsByStudent(@PathVariable int studentId){
        return  ResponseEntity.ok(financeService.GetTransactionsByStudent(studentId));
    }
    @GetMapping("/invoiced-transactions/student/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getInvoicedTransactionsByStudent(@PathVariable int studentId){
        return  ResponseEntity.ok(financeService.GetInvoicedTransactionsByStudent(studentId));
    }
    @GetMapping("/payment-transactions/student/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getPaymentTransactionsByStudent(@PathVariable int studentId){
        return ResponseEntity.ok(financeService.GetPaymentTransactionsByStudent(studentId));
    }

    @GetMapping("/summary-by-date/{startDate}/{endDate}")
    public ResponseEntity<List<Map<String, Object>>> getSummaryByDate(
            @PathVariable String startDate, @PathVariable String endDate){
        return ResponseEntity.ok(financeService.summaryByDate(startDate,endDate));
    }
    @GetMapping("/summary-by-class/{startDate}/{endDate}")
    public ResponseEntity<List<Map<String, Object>>> getSummaryByClass(
            @PathVariable String startDate, @PathVariable String endDate){
        return ResponseEntity.ok(financeService.summaryByClass(startDate,endDate));
    }

    @GetMapping("/payments-summary/{startDate}/{endDate}")
    public ResponseEntity<List<Map<String,Object>>> getPaymentsSummary(@PathVariable String startDate, @PathVariable String endDate){
        return ResponseEntity.ok(financeService.GetPaymentsSummary(startDate,endDate));
    }

    //New endpoint
    @GetMapping("/bank-payment-transactions/{startDate}/{endDate}")
    public ResponseEntity<List<Map<String, Object>>> getBankPaymentTransactionReport(
            @PathVariable String startDate, @PathVariable String endDate) {
        return ResponseEntity.ok(financeService.GetBankPaymentTransactionReport(startDate, endDate));
    }

    // New Endpoint for trial balance report
    @GetMapping("/trial-balance/{startDate}/{endDate}")
    public ResponseEntity<List<Map<String, Object>>> getTrialBalance(
            @PathVariable String startDate, @PathVariable String endDate) {
        return ResponseEntity.ok(financeService.GetTrialBalance(startDate, endDate));
    }
    //New endpoint for income statement
    @GetMapping("/income-statement/{startDate}/{endDate}")
    public ResponseEntity<List<Map<String, Object>>> getIncomeStatement(
            @PathVariable String startDate, @PathVariable String endDate){
        return ResponseEntity.ok(financeService.GetIncomeStatement(startDate,endDate));
    }
    //New endpoint for cash flow statement
    @GetMapping("/cash-flow-statement/{startDate}/{endDate}")
    public ResponseEntity<List<Map<String, Object>>> getCashFlowStatement(
            @PathVariable String startDate, @PathVariable String endDate){
        return ResponseEntity.ok(financeService.GetCashFlowStatement(startDate,endDate));
    }
    //New endpoint for cash book
    @GetMapping("/cash-book/{startDate}/{endDate}")
    public ResponseEntity<List<Map<String, Object>>> getCashBook(
            @PathVariable String startDate, @PathVariable String endDate){
        return ResponseEntity.ok(financeService.GetCashBook(startDate,endDate));
    }
    //New Endpoint for balance sheet
    @GetMapping("/balance-sheet/{asOfDate}")
    public ResponseEntity<List<Map<String, Object>>> getBalanceSheet(
            @PathVariable String asOfDate) {
        return ResponseEntity.ok(financeService.GetBalanceSheet(asOfDate));
    }

    //New endpoint for ledger transaction
    @GetMapping("/ledger-transactions/{startDate}/{endDate}/{accountChartId}")
    public ResponseEntity<List<Map<String,Object>>> getLedgerTransactions(
            @PathVariable String startDate,
            @PathVariable String endDate,
            @PathVariable int accountChartId){
        return ResponseEntity.ok(financeService.GetLedgerTransactions(startDate, endDate, accountChartId));

    }

    //New endpoint for payment vouchers
    @GetMapping("/payment-vouchers")
    public ResponseEntity<List<Map<String, Object>>> getPaymentVouchers() {
        return ResponseEntity.ok(financeService.GetPaymentVouchers());
    }
    //New endpoint for supplier invoices
    @GetMapping("/supplier-invoices")
    public ResponseEntity<List<Map<String, Object>>> getSupplierInvoices() {
        return ResponseEntity.ok(financeService.GetSupplierInvoices());
    }
}