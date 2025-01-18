package com.ctecx.argosfims.tenant.transactions;


import com.ctecx.argosfims.util.ResponseWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class FeePaymentController {

    private final FeePaymentService feePaymentService;

    @PostMapping
    public ResponseEntity<ResponseWrapper<String>> processFeePayment(@RequestBody PaymentRequest paymentRequest) {
        log.info("Received fee payment request: {}", paymentRequest);

        try {
            String transactionReference = feePaymentService.saveFees(paymentRequest);
            log.info("Successfully processed fee payment. Transaction Reference: {}", transactionReference);

            ResponseWrapper<String> response = new ResponseWrapper<>(true, "Payment processed successfully", transactionReference);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            log.error("Error processing fee payment", e);
            ResponseWrapper<String> response = new ResponseWrapper<>(false, "Error processing payment: " + e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}