package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.payments.InvoicePaymentDTO;
import com.ctecx.argosfims.tenant.payments.PaymentVoucherDTO;
import com.ctecx.argosfims.tenant.payments.SupplierInvoiceDTO;
import com.ctecx.argosfims.tenant.transactions.BulkInvoice;
import com.ctecx.argosfims.tenant.transactions.PaymentRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounting")
@AllArgsConstructor
public class AccountingController {

    private final ComprehensiveAccountingSystem comprehensiveAccountingSystem;

    @PostMapping("/recordPaymentVoucher")
    public ResponseEntity<?> recordPaymentVoucher(@RequestBody PaymentVoucherDTO request) {
        try {
            comprehensiveAccountingSystem.recordPaymentVoucher(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Payment voucher recorded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing payment voucher: " + e.getMessage());
        }
    }

    @PostMapping("/recordSupplierInvoice")
    public ResponseEntity<?> recordSupplierInvoice(@RequestBody SupplierInvoiceDTO request) {
        try {
            comprehensiveAccountingSystem.recordSupplierInvoice(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Supplier invoice recorded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing supplier invoice: " + e.getMessage());
        }
    }

    @PostMapping("/recordInvoicePayment")
    public ResponseEntity<?> recordInvoicePayment(@RequestBody InvoicePaymentDTO request) {
        try {
            comprehensiveAccountingSystem.recordSupplierInvoicePayment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Invoice payment recorded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing invoice payment: " + e.getMessage());
        }
    }
    @PostMapping("/recordStudentBulkInvoice")
    public ResponseEntity<?> recordStudentBulkInvoice(@RequestBody BulkInvoice request) {
        try {
            comprehensiveAccountingSystem.recordStudentBulkInvoice(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Student bulk invoice recorded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing student bulk invoice: " + e.getMessage());
        }
    }

    @PostMapping("/recordStudentPayment")
    public ResponseEntity<?> recordStudentPayment(@RequestBody PaymentRequest request) {
        try {
            comprehensiveAccountingSystem.recordStudentPayment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Student payment recorded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing student payment: " + e.getMessage());
        }
    }


}