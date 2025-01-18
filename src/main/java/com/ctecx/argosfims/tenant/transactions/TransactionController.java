package com.ctecx.argosfims.tenant.transactions;


import com.ctecx.argosfims.util.ResponseWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/bulk-invoice")
    public ResponseEntity<ResponseWrapper<Void>> processBulkInvoice(@RequestBody BulkInvoice bulkInvoice) {
        try {
            transactionService.processBulkInvoice(bulkInvoice);
            ResponseWrapper<Void> response = new ResponseWrapper<>(true,"Successfully processed bulk invoice", null);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            ResponseWrapper<Void> response = new ResponseWrapper<>(false, e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            ResponseWrapper<Void> response = new ResponseWrapper<>(false, e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            ResponseWrapper<Void> response = new ResponseWrapper<>(false, "An unexpected error occurred.", null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}