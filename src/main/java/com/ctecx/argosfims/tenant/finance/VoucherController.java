package com.ctecx.argosfims.tenant.finance;



import com.ctecx.argosfims.tenant.receipts.PaymentVoucherDTO;
import com.ctecx.argosfims.tenant.receipts.PaymentVoucherGenerator;
import com.itextpdf.text.DocumentException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private static final Logger LOGGER = Logger.getLogger(VoucherController.class.getName());

    private final FinanceService financeService;
    private final PaymentVoucherGenerator paymentVoucherGenerator;


    @GetMapping("/generate/{voucherNumber}")
    public ResponseEntity<byte[]> generateVoucher(@PathVariable String voucherNumber) throws DocumentException, IOException {
        PaymentVoucherDTO paymentVoucherDTO =  mapVoucherData(financeService.GetPaymentVoucherDetailsByVoucherNumber(voucherNumber));
        if(paymentVoucherDTO == null) {
            LOGGER.log(Level.WARNING, "No data found for voucher number: " + voucherNumber);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.ENGLISH).format(new Date());
        String outputFilename = "Payment_Voucher_" + timeStamp + ".pdf";
        Path outputPath = tempDir.resolve(outputFilename);


        paymentVoucherGenerator.createPaymentVoucherPDF(outputPath.toString(),paymentVoucherDTO);

        try {
            outputStream = paymentVoucherGenerator.createPdfDocument(paymentVoucherDTO);
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "payment_voucher.pdf");

        LOGGER.log(Level.INFO, "Voucher generated successfully for voucher number: " + voucherNumber);
        return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
    }

    private PaymentVoucherDTO mapVoucherData(List<Map<String, Object>> voucherData) {
        if (voucherData == null || voucherData.isEmpty()) {
            return null;
        }
        Map<String, Object> data = voucherData.get(0);
        return new PaymentVoucherDTO(
                (String) data.get("voucher_number"),
                (Date) data.get("voucher_date"),
                (String) data.get("voucher_type"),
                (String) data.get("payee"),
                (String) data.get("voucher_description"),
                (java.math.BigDecimal) data.get("amount"),
                (String) data.get("expense_account_name"),
                (String) data.get("funding_account_name")
        );
    }


}