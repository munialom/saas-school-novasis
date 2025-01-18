package com.ctecx.argosfims.tenant.receipts;



import com.itextpdf.text.*;
import com.itextpdf.text.pdf.FontSelector;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;
@Service
public class PaymentVoucherGenerator {

    private static final Logger LOGGER = Logger.getLogger(PaymentVoucherGenerator.class.getName());

    // School Details
    private static final String SCHOOL_NAME = "Example High School";
    private static final String SCHOOL_ADDRESS = "123 Main Street";
    private static final String SCHOOL_LOCATION = "Nairobi, Kenya";
    private static final String SCHOOL_CONTACT = "+254-700-000-000";


    public ByteArrayOutputStream createPdfDocument(PaymentVoucherDTO paymentVoucherDTO) throws DocumentException, IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, outputStream);
        document.open();

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
        Paragraph schoolContact = new Paragraph("Contact: " + SCHOOL_CONTACT, schoolContactFont);
        schoolContact.setAlignment(Element.ALIGN_CENTER);

        schoolHeaderTable.addCell(getSchoolHeaderCell(schoolName));
        schoolHeaderTable.addCell(getSchoolHeaderCell(schoolAddress));
        schoolHeaderTable.addCell(getSchoolHeaderCell(schoolContact));
        schoolHeaderTable.setSpacingAfter(10f);


        // Invoice header details table
        PdfPTable irdTable = new PdfPTable(2);
        irdTable.addCell(getIRDCell("Receipt No"));
        irdTable.addCell(getIRDCell("Receipt Date"));
        irdTable.addCell(getIRDCell(paymentVoucherDTO.getVoucherNumber()));
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);
        String formattedDate = dateFormat.format(paymentVoucherDTO.getVoucherDate());
        irdTable.addCell(getIRDCell(formattedDate));

        PdfPTable irhTable = new PdfPTable(3);
        irhTable.setWidthPercentage(100);

        irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
        irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
        irhTable.addCell(getIRHCell("OFFICIAL PAYMENT VOUCHER", PdfPCell.ALIGN_LEFT));
        irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
        irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
        PdfPCell invoiceTable = new PdfPCell(irdTable);
        invoiceTable.setBorder(0);
        irhTable.addCell(invoiceTable);


        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, Font.BOLD); // Reduced font size
        fs.addFont(font);
        Phrase bill = fs.process("Voucher Details:");
        Paragraph name = new Paragraph("Payee: " + paymentVoucherDTO.getPayee());
        Paragraph contact = new Paragraph("Voucher Type: " + paymentVoucherDTO.getVoucherType());
        Paragraph address = new Paragraph("Voucher Description: " + paymentVoucherDTO.getVoucherDescription());


        // Items Table
        PdfPTable billTable = new PdfPTable(3);
        billTable.setWidthPercentage(100);
        billTable.setWidths(new float[]{1, 5, 2});
        billTable.setSpacingBefore(15.0f); // Reduced spacing

        billTable.addCell(getBillHeaderCell("Index"));
        billTable.addCell(getBillHeaderCell("Payment For Account"));
        billTable.addCell(getBillHeaderCell("Amount"));


        // using fixed value for the payment
        billTable.addCell(getBillRowCell("1"));
        billTable.addCell(getBillRowCell(paymentVoucherDTO.getVoucherDescription()));
        billTable.addCell(getBillRowCell(String.valueOf(paymentVoucherDTO.getAmount())));


        // Calculate the number of rows to add to fill space, ensure at least 10 rows
        int minRows = 15;
        int rowsToAdd = Math.max(0, minRows - 1);


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
        PdfPCell paymentTextCell = getValidityCell("Expense Account: " + paymentVoucherDTO.getExpenseAccountName() + ", Funding Account: " + paymentVoucherDTO.getFundingAccountName());
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
        accounts.addCell(getAccountsCellR(String.valueOf(paymentVoucherDTO.getAmount())));
        accounts.addCell(getAccountsCell("Balance"));
        accounts.addCell(getAccountsCellR(String.valueOf(BigDecimal.ZERO))); // we are assuming that the balance will be zero
        PdfPCell summaryR = new PdfPCell(accounts);
        summaryR.setColspan(1); // Span only one column for amounts
        billTable.addCell(summaryR);


        // Disclaimer
        PdfPTable describer = new PdfPTable(1);
        describer.setWidthPercentage(100);
        describer.addCell(getdescCell(" "));
        describer.addCell(getdescCell("Fees once paid will not be refunded || Subject to school rules and regulations"));

        document.add(schoolHeaderTable);
        document.add(irhTable);
        document.add(bill);
        document.add(name);
        document.add(contact);
        document.add(address);
        document.add(billTable);
        document.add(describer);
        document.close();
        return outputStream;

    }


    public void createPaymentVoucherPDF(String pdfFilename, PaymentVoucherDTO paymentVoucherDTO) {
        try {
            OutputStream file = new FileOutputStream(new File(pdfFilename));
            // set A4 page size
            Document document = new Document(PageSize.A4);
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
            Paragraph schoolContact = new Paragraph("Contact: " + SCHOOL_CONTACT, schoolContactFont);
            schoolContact.setAlignment(Element.ALIGN_CENTER);

            schoolHeaderTable.addCell(getSchoolHeaderCell(schoolName));
            schoolHeaderTable.addCell(getSchoolHeaderCell(schoolAddress));
            schoolHeaderTable.addCell(getSchoolHeaderCell(schoolContact));
            schoolHeaderTable.setSpacingAfter(10f);


            // Invoice header details table
            PdfPTable irdTable = new PdfPTable(2);
            irdTable.addCell(getIRDCell("Receipt No"));
            irdTable.addCell(getIRDCell("Receipt Date"));
            irdTable.addCell(getIRDCell(paymentVoucherDTO.getVoucherNumber()));
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);
            String formattedDate = dateFormat.format(paymentVoucherDTO.getVoucherDate());
            irdTable.addCell(getIRDCell(formattedDate));

            PdfPTable irhTable = new PdfPTable(3);
            irhTable.setWidthPercentage(100);

            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("OFFICIAL PAYMENT VOUCHER", PdfPCell.ALIGN_LEFT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            PdfPCell invoiceTable = new PdfPCell(irdTable);
            invoiceTable.setBorder(0);
            irhTable.addCell(invoiceTable);


            FontSelector fs = new FontSelector();
            Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, Font.BOLD); // Reduced font size
            fs.addFont(font);
            Phrase bill = fs.process("Voucher Details:");
            Paragraph name = new Paragraph("Payee: " + paymentVoucherDTO.getPayee());
            Paragraph contact = new Paragraph("Voucher Type: " + paymentVoucherDTO.getVoucherType());
            Paragraph address = new Paragraph("Voucher Description: " + paymentVoucherDTO.getVoucherDescription());


            // Items Table
            PdfPTable billTable = new PdfPTable(3);
            billTable.setWidthPercentage(100);
            billTable.setWidths(new float[]{1, 5, 2});
            billTable.setSpacingBefore(15.0f); // Reduced spacing

            billTable.addCell(getBillHeaderCell("Index"));
            billTable.addCell(getBillHeaderCell("Payment For Account"));
            billTable.addCell(getBillHeaderCell("Amount"));


            // using fixed value for the payment
            billTable.addCell(getBillRowCell("1"));
            billTable.addCell(getBillRowCell(paymentVoucherDTO.getVoucherDescription()));
            billTable.addCell(getBillRowCell(String.valueOf(paymentVoucherDTO.getAmount())));


            // Calculate the number of rows to add to fill space, ensure at least 10 rows
            int minRows = 15;
            int rowsToAdd = Math.max(0, minRows - 1);


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
            PdfPCell paymentTextCell = getValidityCell("Expense Account: " + paymentVoucherDTO.getExpenseAccountName() + ", Funding Account: " + paymentVoucherDTO.getFundingAccountName());
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
            accounts.addCell(getAccountsCellR(String.valueOf(paymentVoucherDTO.getAmount())));
            accounts.addCell(getAccountsCell("Balance"));
            accounts.addCell(getAccountsCellR(String.valueOf(BigDecimal.ZERO))); // we are assuming that the balance will be zero
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