package com.ctecx.argosfims.tenant.receipts;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;
@Service
public class InvoiceGenerator {

    private static final Logger LOGGER = Logger.getLogger(InvoiceGenerator.class.getName());

    // School Details
    private static final String SCHOOL_NAME = "Example High School";
    private static final String SCHOOL_ADDRESS = "123 Main Street";
    private static final String SCHOOL_LOCATION = "Nairobi, Kenya";
    private static final String SCHOOL_CONTACT = "+254-700-000-000";


    public static void main(String[] args) {

        // Generate a unique filename using date and time
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.ENGLISH).format(new Date());
        String outputFilename = "School_Receipt_" + timeStamp + ".pdf";

        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
        Path outputPath = tempDir.resolve(outputFilename);

        InvoiceGenerator generator = new InvoiceGenerator();

        // Sample Data
        SchoolReceiptStudentDTO studentDTO = new SchoolReceiptStudentDTO("Mary Williams", "ADM004", "Form 2", "North");
        ReceiptDetailsDTO receiptDetailsDTO = new ReceiptDetailsDTO("Kcb Bank tuition ", new Date(), "MPESA", "fx");

        List<SchoolReceiptItemDTO> receiptItemDTOS = List.of(
                new SchoolReceiptItemDTO(1, "Exams", "Exams", 3000.0),
                new SchoolReceiptItemDTO(2, "Tuition", "Tuition", 0.0)
        );

        SchoolReceiptSummaryDTO summaryDTO = new SchoolReceiptSummaryDTO(3000.0, 2000.0);


        generator.createPDF(outputPath.toString(), studentDTO, receiptDetailsDTO, receiptItemDTOS, summaryDTO);

    }

    public ByteArrayOutputStream createPdfDocument(SchoolReceiptStudentDTO studentDTO, ReceiptDetailsDTO receiptDetailsDTO, List<SchoolReceiptItemDTO> receiptItemDTOS, SchoolReceiptSummaryDTO summaryDTO) throws DocumentException, java.io.IOException {

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        // set A5 page size
        Document document = new Document(PageSize.A5);
        document.setMargins(20, 20, 30, 20); // reduced margins to make more space

        PdfWriter.getInstance(document, outputStream);

        // School Header Table
        PdfPTable schoolHeaderTable = new PdfPTable(1);
        schoolHeaderTable.setWidthPercentage(100);
        schoolHeaderTable.setHorizontalAlignment(Element.ALIGN_CENTER);


        Font schoolNameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Font schoolAddressFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        Font schoolContactFont = FontFactory.getFont(FontFactory.HELVETICA, 10);


        Paragraph schoolName = new Paragraph(SCHOOL_NAME, schoolNameFont);
        schoolName.setAlignment(Element.ALIGN_CENTER);


        Paragraph schoolAddress = new Paragraph(SCHOOL_ADDRESS + ", " + SCHOOL_LOCATION, schoolAddressFont);
        schoolAddress.setAlignment(Element.ALIGN_CENTER);
        Paragraph schoolContact = new Paragraph("Contact: " + SCHOOL_CONTACT,schoolContactFont);
        schoolContact.setAlignment(Element.ALIGN_CENTER);

        schoolHeaderTable.addCell(getSchoolHeaderCell(schoolName));
        schoolHeaderTable.addCell(getSchoolHeaderCell(schoolAddress));
        schoolHeaderTable.addCell(getSchoolHeaderCell(schoolContact));
        schoolHeaderTable.setSpacingAfter(10f);


        // Invoice header details table
        PdfPTable irdTable = new PdfPTable(2);
        irdTable.addCell(getIRDCell("Receipt No"));
        irdTable.addCell(getIRDCell("Receipt Date"));
        irdTable.addCell(getIRDCell("Receipt-001"));
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);
        String formattedDate = dateFormat.format(new Date());
        irdTable.addCell(getIRDCell(formattedDate));

        PdfPTable irhTable = new PdfPTable(3);
        irhTable.setWidthPercentage(100);

        irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
        irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
        irhTable.addCell(getIRHCell("OFFICIAL RECEIPT", PdfPCell.ALIGN_LEFT));
        irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
        irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
        PdfPCell invoiceTable = new PdfPCell(irdTable);
        invoiceTable.setBorder(0);
        irhTable.addCell(invoiceTable);

        // Bill To information
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, Font.BOLD); // Reduced font size
        fs.addFont(font);
        Phrase bill = fs.process("Student Details:");
        Paragraph name = new Paragraph(studentDTO.getStudentName());
        // name.setIndentationLeft(10); // Reduced indentation
        Paragraph contact = new Paragraph("Admission No: " + studentDTO.getAdmissionNumber());
        // contact.setIndentationLeft(10);
        Paragraph address = new Paragraph(studentDTO.getClassName() + ", " + studentDTO.getStreamName());
        //address.setIndentationLeft(10);

        // Items Table
        PdfPTable billTable = new PdfPTable(3);
        billTable.setWidthPercentage(100);
        billTable.setWidths(new float[]{1, 5, 2});
        billTable.setSpacingBefore(15.0f); // Reduced spacing

        billTable.addCell(getBillHeaderCell("Index"));
        billTable.addCell(getBillHeaderCell("Payment For Account"));
        billTable.addCell(getBillHeaderCell("Amount"));


        for (SchoolReceiptItemDTO item : receiptItemDTOS) {
            billTable.addCell(getBillRowCell(String.valueOf(item.getIndex())));
            billTable.addCell(getBillRowCell(item.getAccountName()));
            billTable.addCell(getBillRowCell(String.valueOf(item.getPaymentForAccount())));
        }


        // Calculate the number of rows to add to fill space, ensure at least 10 rows
        int minRows = 15;
        int rowsToAdd = Math.max(0, minRows - receiptItemDTOS.size());


        for (int i = 0; i < rowsToAdd; i++) {
            billTable.addCell(getBillRowCell(" "));
            billTable.addCell(getBillRowCell(""));
            billTable.addCell(getBillRowCell(""));

        }


        // Validity (Warranty) Information
        PdfPTable validity = new PdfPTable(1);
        validity.setWidthPercentage(100);
        PdfPCell paymentDetailsCell = getValidityCell("Payment Details");
        paymentDetailsCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        paymentDetailsCell.setPaddingLeft(5f);
        validity.addCell(paymentDetailsCell);
        PdfPCell paymentTextCell = getValidityCell("Mode:" + receiptDetailsDTO.getPaymentMode() + " Transaction Ref: " + receiptDetailsDTO.getTransactionRefNo() + ", Banking Date: " + dateFormat.format(receiptDetailsDTO.getBankingDate()) + ", Bank: " + receiptDetailsDTO.getBankName());
        paymentTextCell.setPaddingLeft(5f);
        validity.addCell(paymentTextCell);
        PdfPCell summaryL = new PdfPCell(validity);
        summaryL.setColspan(2); // Span only two columns for payment details
        summaryL.setPadding(1.0f);
        billTable.addCell(summaryL);


        // Summary section
        PdfPTable accounts = new PdfPTable(2);
        accounts.setWidthPercentage(100);
        accounts.addCell(getAccountsCell("Amount Paid"));
        accounts.addCell(getAccountsCellR(String.valueOf(summaryDTO.getAmountPaid())));
        accounts.addCell(getAccountsCell("Balance"));
        accounts.addCell(getAccountsCellR(String.valueOf(summaryDTO.getBalance())));
        PdfPCell summaryR = new PdfPCell(accounts);
        summaryR.setColspan(1); // Span only one column for amounts
        billTable.addCell(summaryR);


        // Disclaimer
        PdfPTable describer = new PdfPTable(1);
        describer.setWidthPercentage(100);
        describer.addCell(getdescCell(" "));
        describer.addCell(getdescCell("Fees once paid will not be refunded || Subject to school rules and regulations"));

        document.open();//PDF document opened........
        document.add(schoolHeaderTable);
        document.add(irhTable);
        document.add(bill);
        document.add(name);
        document.add(contact);
        document.add(address);
        document.add(billTable);
        document.add(describer);

        document.close();

        LOGGER.log(Level.INFO, "Pdf created successfully");
        return outputStream;

    }


    public void createPDF(String pdfFilename, SchoolReceiptStudentDTO studentDTO, ReceiptDetailsDTO receiptDetailsDTO, List<SchoolReceiptItemDTO> receiptItemDTOS, SchoolReceiptSummaryDTO summaryDTO) {
        try {
            OutputStream file = new FileOutputStream(new File(pdfFilename));
            // set A5 page size
            Document document = new Document(PageSize.A5);
            document.setMargins(20, 20, 30, 20); // reduced margins to make more space

            PdfWriter.getInstance(document, file);

            // School Header Table
            PdfPTable schoolHeaderTable = new PdfPTable(1);
            schoolHeaderTable.setWidthPercentage(100);
            schoolHeaderTable.setHorizontalAlignment(Element.ALIGN_CENTER);


            Font schoolNameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font schoolAddressFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font schoolContactFont = FontFactory.getFont(FontFactory.HELVETICA, 10);


            Paragraph schoolName = new Paragraph(SCHOOL_NAME, schoolNameFont);
            schoolName.setAlignment(Element.ALIGN_CENTER);


            Paragraph schoolAddress = new Paragraph(SCHOOL_ADDRESS + ", " + SCHOOL_LOCATION, schoolAddressFont);
            schoolAddress.setAlignment(Element.ALIGN_CENTER);
            Paragraph schoolContact = new Paragraph("Contact: " + SCHOOL_CONTACT,schoolContactFont);
            schoolContact.setAlignment(Element.ALIGN_CENTER);

            schoolHeaderTable.addCell(getSchoolHeaderCell(schoolName));
            schoolHeaderTable.addCell(getSchoolHeaderCell(schoolAddress));
            schoolHeaderTable.addCell(getSchoolHeaderCell(schoolContact));
            schoolHeaderTable.setSpacingAfter(10f);


            // Invoice header details table
            PdfPTable irdTable = new PdfPTable(2);
            irdTable.addCell(getIRDCell("Receipt No"));
            irdTable.addCell(getIRDCell("Receipt Date"));
            irdTable.addCell(getIRDCell("Receipt-001"));
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);
            String formattedDate = dateFormat.format(new Date());
            irdTable.addCell(getIRDCell(formattedDate));

            PdfPTable irhTable = new PdfPTable(3);
            irhTable.setWidthPercentage(100);

            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("OFFICIAL RECEIPT", PdfPCell.ALIGN_LEFT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            PdfPCell invoiceTable = new PdfPCell(irdTable);
            invoiceTable.setBorder(0);
            irhTable.addCell(invoiceTable);

            // Bill To information
            FontSelector fs = new FontSelector();
            Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, Font.BOLD); // Reduced font size
            fs.addFont(font);
            Phrase bill = fs.process("Student Details:");
            Paragraph name = new Paragraph(studentDTO.getStudentName());
            // name.setIndentationLeft(10); // Reduced indentation
            Paragraph contact = new Paragraph("Admission No: " + studentDTO.getAdmissionNumber());
            // contact.setIndentationLeft(10);
            Paragraph address = new Paragraph(studentDTO.getClassName() + ", " + studentDTO.getStreamName());
            //address.setIndentationLeft(10);

            // Items Table
            PdfPTable billTable = new PdfPTable(3);
            billTable.setWidthPercentage(100);
            billTable.setWidths(new float[]{1, 5, 2});
            billTable.setSpacingBefore(15.0f); // Reduced spacing

            billTable.addCell(getBillHeaderCell("Index"));
            billTable.addCell(getBillHeaderCell("Payment For Account"));
            billTable.addCell(getBillHeaderCell("Amount"));


            for (SchoolReceiptItemDTO item : receiptItemDTOS) {
                billTable.addCell(getBillRowCell(String.valueOf(item.getIndex())));
                billTable.addCell(getBillRowCell(item.getAccountName()));
                billTable.addCell(getBillRowCell(String.valueOf(item.getPaymentForAccount())));
            }


            // Calculate the number of rows to add to fill space, ensure at least 10 rows
            int minRows = 15;
            int rowsToAdd = Math.max(0, minRows - receiptItemDTOS.size());


            for (int i = 0; i < rowsToAdd; i++) {
                billTable.addCell(getBillRowCell(" "));
                billTable.addCell(getBillRowCell(""));
                billTable.addCell(getBillRowCell(""));

            }


            // Validity (Warranty) Information
            PdfPTable validity = new PdfPTable(1);
            validity.setWidthPercentage(100);
            PdfPCell paymentDetailsCell = getValidityCell("Payment Details");
            paymentDetailsCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            paymentDetailsCell.setPaddingLeft(5f);
            validity.addCell(paymentDetailsCell);
            PdfPCell paymentTextCell = getValidityCell("Mode:" + receiptDetailsDTO.getPaymentMode() + " Transaction Ref: " + receiptDetailsDTO.getTransactionRefNo() + ", Banking Date: " + dateFormat.format(receiptDetailsDTO.getBankingDate()) + ", Bank: " + receiptDetailsDTO.getBankName());
            paymentTextCell.setPaddingLeft(5f);
            validity.addCell(paymentTextCell);
            PdfPCell summaryL = new PdfPCell(validity);
            summaryL.setColspan(2); // Span only two columns for payment details
            summaryL.setPadding(1.0f);
            billTable.addCell(summaryL);


            // Summary section
            PdfPTable accounts = new PdfPTable(2);
            accounts.setWidthPercentage(100);
            accounts.addCell(getAccountsCell("Amount Paid"));
            accounts.addCell(getAccountsCellR(String.valueOf(summaryDTO.getAmountPaid())));
            accounts.addCell(getAccountsCell("Balance"));
            accounts.addCell(getAccountsCellR(String.valueOf(summaryDTO.getBalance())));
            PdfPCell summaryR = new PdfPCell(accounts);
            summaryR.setColspan(1); // Span only one column for amounts
            billTable.addCell(summaryR);


            // Disclaimer
            PdfPTable describer = new PdfPTable(1);
            describer.setWidthPercentage(100);
            describer.addCell(getdescCell(" "));
            describer.addCell(getdescCell("Fees once paid will not be refunded || Subject to school rules and regulations"));

            document.open();//PDF document opened........
            document.add(schoolHeaderTable);
            document.add(irhTable);
            document.add(bill);
            document.add(name);
            document.add(contact);
            document.add(address);
            document.add(billTable);
            document.add(describer);

            document.close();
            file.close();

            LOGGER.log(Level.INFO, "Pdf created successfully at: " + pdfFilename);

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error creating PDF", e);
        }
    }


    // Helper methods (same as before, just add Logger instead of System.out.print)
    public static PdfPCell getIRHCell(String text, int alignment) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 14); // Reduced font size
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setPadding(3);
        cell.setHorizontalAlignment(alignment);
        cell.setBorder(PdfPCell.NO_BORDER);
        return cell;
    }
    public static PdfPCell getSchoolHeaderCell(Paragraph paragraph) {
        PdfPCell cell = new PdfPCell(paragraph);
        cell.setBorder(0);
        cell.setPadding(2f);
        return cell;
    }
    public static PdfPCell getIRDCell(String text) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, FontFactory.getFont(FontFactory.HELVETICA, 9))); // Reduced font size
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(3.0f);
        cell.setBorderColor(BaseColor.LIGHT_GRAY);
        return cell;
    }

    public static PdfPCell getBillHeaderCell(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 10);  // Reduced font size
        font.setColor(BaseColor.GRAY);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(3.0f);
        return cell;
    }

    public static PdfPCell getBillRowCell(String text) {
        PdfPCell cell = new PdfPCell(new Paragraph(text,FontFactory.getFont(FontFactory.HELVETICA, 9))); // Reduced font size
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setPadding(3.0f);
        cell.setBorderWidthBottom(0);
        cell.setBorderWidthTop(0);
        cell.setPaddingLeft(10); // Add left padding for better text alignment
        return cell;
    }


    public static PdfPCell getValidityCell(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 9); // Reduced font size
        font.setColor(BaseColor.GRAY);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setBorder(0);
        return cell;
    }

    public static PdfPCell getAccountsCell(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 9); // Reduced font size
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setBorderWidthRight(0);
        cell.setBorderWidthTop(0);
        cell.setPadding(3.0f);
        return cell;
    }

    public static PdfPCell getAccountsCellR(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 9); // Reduced font size
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setBorderWidthLeft(0);
        cell.setBorderWidthTop(0);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cell.setPadding(3.0f);
        cell.setPaddingRight(10.0f);
        return cell;
    }

    public static PdfPCell getdescCell(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 9); // Reduced font size
        font.setColor(BaseColor.GRAY);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorder(0);
        return cell;
    }
}