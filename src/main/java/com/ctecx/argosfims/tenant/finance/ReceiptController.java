package com.ctecx.argosfims.tenant.finance;

import com.ctecx.argosfims.tenant.receipts.*;
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
import java.math.BigDecimal;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;


@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
public class ReceiptController {
    private static final Logger LOGGER = Logger.getLogger(ReceiptController.class.getName());

    private final FinanceService financeService;
    private final InvoiceGenerator invoiceGenerator;

    @GetMapping("/generate/{serialNumber}")
    public ResponseEntity<byte[]> generateReceipt(@PathVariable String serialNumber) throws DocumentException, IOException, ParseException {
        List<Map<String, Object>> receiptData = financeService.generateStudentReceiptBySerialNumber(serialNumber);

        LOGGER.log(Level.INFO, "Raw receipt data: " + receiptData); // Log the raw data

        if (receiptData == null || receiptData.isEmpty()) {
            LOGGER.log(Level.WARNING, "No data found for serial number: " + serialNumber);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Extract and map data
        SchoolReceiptStudentDTO studentDTO = mapStudentData(receiptData.get(0));
        ReceiptDetailsDTO receiptDetailsDTO = mapReceiptDetails(receiptData.get(0));
        List<SchoolReceiptItemDTO> receiptItemDTOS = mapReceiptItems(receiptData);
        SchoolReceiptSummaryDTO summaryDTO = mapSummary(receiptData.get(0));


        // Generate PDF
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.ENGLISH).format(new Date());
        String outputFilename = "School_Receipt_" + timeStamp + ".pdf";
        Path outputPath = tempDir.resolve(outputFilename);

        invoiceGenerator.createPDF(outputPath.toString(),studentDTO, receiptDetailsDTO, receiptItemDTOS, summaryDTO);

        try {
            outputStream = invoiceGenerator.createPdfDocument(studentDTO, receiptDetailsDTO, receiptItemDTOS, summaryDTO);
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }

        // Set up the response
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "receipt.pdf");

        LOGGER.log(Level.INFO, "Receipt generated successfully for serial number: " + serialNumber);
        return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);

    }
    private SchoolReceiptStudentDTO mapStudentData(Map<String, Object> data) {
        return new SchoolReceiptStudentDTO(
                (String) data.get("StudentName"),
                (String) data.get("AdmissionNumber"),
                (String) data.get("Class"),
                (String) data.get("Stream")
        );
    }
    private  ReceiptDetailsDTO mapReceiptDetails(Map<String, Object> data) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);
        Date bankingDate;
        try {
            bankingDate = sdf.parse((data.get("BankingDate")).toString());
        } catch (ParseException | NullPointerException e) {
            bankingDate = new Date();
        }


        return new ReceiptDetailsDTO(
                (String) data.get("BankName"),
                bankingDate,
                (String) data.get("Mode"),
                (String) data.get("PaymentRef")

        );
    }
    private  List<SchoolReceiptItemDTO> mapReceiptItems(List<Map<String, Object>> data) {
        List<SchoolReceiptItemDTO> items = new ArrayList<>();
        int index = 1;
        for (Map<String, Object> itemData : data) {
            if (itemData.get("AccountName") != null) {
                Double paymentForAccount = null;
                Object paymentObject = itemData.get("PaymentForAccount");
                if (paymentObject != null) {
                    if (paymentObject instanceof BigDecimal) {
                        paymentForAccount = ((BigDecimal) paymentObject).doubleValue();
                    } else if (paymentObject instanceof Double) {
                        paymentForAccount = (Double) paymentObject;
                    } else if(paymentObject instanceof String) {
                        paymentForAccount = Double.parseDouble(((String) paymentObject).replace(",", ""));
                    }
                }


                items.add(new SchoolReceiptItemDTO(
                        index++,
                        (String) itemData.get("AccountName"),
                        (String) itemData.get("AccountDescription"),
                        paymentForAccount
                ));
            }

        }

        return items;
    }
    private  SchoolReceiptSummaryDTO mapSummary(Map<String, Object> data) {
        Double totalPayments = null;
        Object totalPaymentsObject = data.get("TotalPayments");
        if (totalPaymentsObject != null) {
            if (totalPaymentsObject instanceof BigDecimal) {
                totalPayments = ((BigDecimal) totalPaymentsObject).doubleValue();
            } else if (totalPaymentsObject instanceof Double) {
                totalPayments = (Double) totalPaymentsObject;
            }else if (totalPaymentsObject instanceof String) {
                totalPayments = Double.parseDouble(((String) totalPaymentsObject).replace(",", ""));
            }
        }

        Double totalBalance = null;
        Object totalBalanceObject = data.get("TotalBalance");
        if (totalBalanceObject != null) {
            if (totalBalanceObject instanceof BigDecimal) {
                totalBalance = ((BigDecimal) totalBalanceObject).doubleValue();
            } else if (totalBalanceObject instanceof Double) {
                totalBalance = (Double) totalBalanceObject;
            } else if(totalBalanceObject instanceof String) {
                totalBalance = Double.parseDouble(((String) totalBalanceObject).replace(",", ""));
            }
        }

        return new SchoolReceiptSummaryDTO(
                totalPayments,
                totalBalance
        );
    }
}