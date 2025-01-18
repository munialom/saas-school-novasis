package com.ctecx.argosfims.tenant.chartofaccounts;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/accounts")
public class AccountChartController {

    private final AccountChartService accountChartService;

    @PostMapping
    public ResponseEntity<String> createAccountChart(@Valid @RequestBody AccountChartRequest request) {
        try {
            String response = accountChartService.createAccountChart(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST); // Or specific exception messages
        }
    }

    @PutMapping
    public ResponseEntity<String> updateAccountChart(@Valid @RequestBody AccountChart request) {
        try {
            String response = accountChartService.updateAccountChart(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping
    public ResponseEntity<List<AccountChart>> getAllAccounts() {
        List<AccountChart> accounts = accountChartService.getAllAccounts();
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<AccountChart>>> getGroupedAccounts() {
        Map<String, List<AccountChart>> groupedAccounts = accountChartService.getGroupedAccounts();
        return new ResponseEntity<>(groupedAccounts, HttpStatus.OK);
    }
}