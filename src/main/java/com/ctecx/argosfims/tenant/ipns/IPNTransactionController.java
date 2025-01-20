package com.ctecx.argosfims.tenant.ipns;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.ctecx.argosfims.tenant.ipns.Constants.SIGNATURE_HEADER;


@Slf4j
@RestController
@RequestMapping("/api/v1/ipn")
@RequiredArgsConstructor
public class IPNTransactionController {
    private final IPNTransactionService ipnTransactionService;

    @PostMapping("/notification")
    public ResponseEntity<IPNResponse> handleIPNNotification(
            @RequestHeader(SIGNATURE_HEADER) String signature,
            @Valid @RequestBody IPNRequest ipnRequest) {

        log.info("Received IPN notification - Transaction: {}, Signature: {}",
                ipnRequest.getTransactionReference(), signature);

        IPNResponse response = ipnTransactionService.processIPNTransaction(ipnRequest, signature);
        return ResponseEntity.ok(response);
    }
}