package com.ctecx.argosfims.tenant.accounting;

import com.ctecx.argosfims.tenant.payments.InvoicePaymentDTO;
import com.ctecx.argosfims.tenant.payments.PaymentVoucherDTO;
import com.ctecx.argosfims.tenant.payments.SupplierInvoiceDTO;
import com.ctecx.argosfims.tenant.transactions.BulkInvoice;
import com.ctecx.argosfims.tenant.transactions.PaymentRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@AllArgsConstructor
public class ComprehensiveAccountingSystem {

    private final RevenueProcessor revenueProcessor;
    private final PaymentVoucherProcessor paymentVoucherProcessor;
    private final SupplierInvoiceProcessor supplierInvoiceProcessor;
    private final InvoicePaymentProcessor invoicePaymentProcessor;
    private final StudentInvoiceProcessor studentInvoiceProcessor;
    private final StudentPaymentProcessor studentPaymentProcessor;



    // Payment Voucher recording
    public void recordPaymentVoucher(PaymentVoucherDTO voucher) {
        paymentVoucherProcessor.processPaymentVoucher(voucher);
    }

    // Supplier Invoice recording
    public void recordSupplierInvoice(SupplierInvoiceDTO invoice) {
        supplierInvoiceProcessor.processSupplierInvoice(invoice);
    }
    // Supplier Invoice Payments
    public void recordSupplierInvoicePayment(InvoicePaymentDTO payment) {
        invoicePaymentProcessor.processInvoicePayment(payment);
    }

    // Student invoice recording
    public void recordStudentBulkInvoice(BulkInvoice bulkInvoice){
        studentInvoiceProcessor.processBulkInvoice(bulkInvoice);
    }

    // Student payment recording
    public void recordStudentPayment(PaymentRequest paymentRequest){
        studentPaymentProcessor.processStudentPayment(paymentRequest);
    }
}