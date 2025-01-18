package com.ctecx.argosfims.tenant.receipts;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.FontSelector;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

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


public class PaymentVoucherGeneratorA4 {

    private static final Logger LOGGER = Logger.getLogger(PaymentVoucherGeneratorA4.class.getName());

    public static void main(String[] args) {
        String outputFilename = "School_Receipt.pdf";
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
        Path outputPath = tempDir.resolve(outputFilename);

        PaymentVoucherGeneratorA4 generator = new PaymentVoucherGeneratorA4();

        // Sample Data
        SchoolReceiptStudentDTO studentDTO = new SchoolReceiptStudentDTO("Mary Williams", "ADM004", "Form 2", "North");
        ReceiptDetailsDTO receiptDetailsDTO = new ReceiptDetailsDTO("Kcb Bank tuition ", new Date(), "MPESA", "fx");

        List<SchoolReceiptItemDTO> receiptItemDTOS = List.of(
                new SchoolReceiptItemDTO(1, "Exams", "Exams", 3000.0),
                new SchoolReceiptItemDTO(2, "Tuition", "Tuition", 0.0)
        );

        SchoolReceiptSummaryDTO summaryDTO = new SchoolReceiptSummaryDTO(3000.0, 2000.0);


        generator.createPDF(outputPath.toString(), studentDTO, receiptDetailsDTO, receiptItemDTOS, summaryDTO );


    }



    public void createPDF(String pdfFilename, SchoolReceiptStudentDTO studentDTO, ReceiptDetailsDTO receiptDetailsDTO, List<SchoolReceiptItemDTO> receiptItemDTOS, SchoolReceiptSummaryDTO summaryDTO) {
        try {
            OutputStream file = new FileOutputStream(new File(pdfFilename));
            Document document = new Document();
            PdfWriter.getInstance(document, file);

            // Inserting Image in PDF
           // Image image = Image.getInstance("src/resources/logo.jpg"); // Header Image
           // image.scaleAbsolute(540f, 72f); // image width,height


            // Invoice header details table
            PdfPTable irdTable = new PdfPTable(2);
            irdTable.addCell(getIRDCell("Invoice No"));
            irdTable.addCell(getIRDCell("Invoice Date"));
            irdTable.addCell(getIRDCell("Receipt-001"));
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);
            String formattedDate = dateFormat.format(new Date());
            irdTable.addCell(getIRDCell(formattedDate));



            PdfPTable irhTable = new PdfPTable(3);
            irhTable.setWidthPercentage(100);

            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("Invoice", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            irhTable.addCell(getIRHCell("", PdfPCell.ALIGN_RIGHT));
            PdfPCell invoiceTable = new PdfPCell (irdTable);
            invoiceTable.setBorder(0);
            irhTable.addCell(invoiceTable);

            // Bill To information
            FontSelector fs = new FontSelector();
            Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN, 13, Font.BOLD);
            fs.addFont(font);
            Phrase bill = fs.process("Bill To");
            Paragraph name = new Paragraph(studentDTO.getStudentName());
            name.setIndentationLeft(20);
            Paragraph contact = new Paragraph("Admission No: " + studentDTO.getAdmissionNumber());
            contact.setIndentationLeft(20);
            Paragraph address = new Paragraph(studentDTO.getClassName() + ", " + studentDTO.getStreamName());
            address.setIndentationLeft(20);

            // Items Table
            PdfPTable billTable = new PdfPTable(6); // one page contains 15 records
            billTable.setWidthPercentage(100);
            billTable.setWidths(new float[]{1, 2, 5, 2, 1, 2});
            billTable.setSpacingBefore(30.0f);

            billTable.addCell(getBillHeaderCell("Index"));
            billTable.addCell(getBillHeaderCell("Account Name"));
            billTable.addCell(getBillHeaderCell("Description"));
            billTable.addCell(getBillHeaderCell("Payment For Account"));
            billTable.addCell(getBillHeaderCell("Qty"));
            billTable.addCell(getBillHeaderCell("Amount"));



            for (SchoolReceiptItemDTO item : receiptItemDTOS) {
                billTable.addCell(getBillRowCell(String.valueOf(item.getIndex())));
                billTable.addCell(getBillRowCell(item.getAccountName()));
                billTable.addCell(getBillRowCell(item.getAccountDescription()));
                billTable.addCell(getBillRowCell(String.valueOf(item.getPaymentForAccount())));
                billTable.addCell(getBillRowCell("1"));
                billTable.addCell(getBillRowCell(String.valueOf(item.getPaymentForAccount())));

            }

            // Add empty rows up to 15
            int rowsToAdd = Math.max(0, 15 - receiptItemDTOS.size());
            for (int i = 0; i < rowsToAdd; i++) {
                billTable.addCell(getBillRowCell(" "));
                billTable.addCell(getBillRowCell(""));
                billTable.addCell(getBillRowCell(""));
                billTable.addCell(getBillRowCell(""));
                billTable.addCell(getBillRowCell(""));
                billTable.addCell(getBillRowCell(""));
            }

            // Validity (Warranty) Information
            PdfPTable validity = new PdfPTable(1);
            validity.setWidthPercentage(100);
            validity.addCell(getValidityCell(" "));
            validity.addCell(getValidityCell("Payment Details"));
            validity.addCell(getValidityCell(  "Mode:" + receiptDetailsDTO.getPaymentMode() + " Transaction Ref: " + receiptDetailsDTO.getTransactionRefNo() + ", Banking Date: "+ dateFormat.format(receiptDetailsDTO.getBankingDate()) + ", Bank: "+ receiptDetailsDTO.getBankName() ));

            PdfPCell summaryL = new PdfPCell(validity);
            summaryL.setColspan(3);
            summaryL.setPadding(1.0f);
            billTable.addCell(summaryL);

            // Summary section
            PdfPTable accounts = new PdfPTable(2);
            accounts.setWidthPercentage(100);
            accounts.addCell(getAccountsCell("Total Amount Paid"));
            accounts.addCell(getAccountsCellR(String.valueOf(summaryDTO.getAmountPaid())));
            accounts.addCell(getAccountsCell("Balance"));
            accounts.addCell(getAccountsCellR(String.valueOf(summaryDTO.getBalance())));
            PdfPCell summaryR = new PdfPCell (accounts);
            summaryR.setColspan (3);
            billTable.addCell(summaryR);



            // Disclaimer
            PdfPTable describer = new PdfPTable(1);
            describer.setWidthPercentage(100);
            describer.addCell(getdescCell(" "));
            describer.addCell(getdescCell("Fees once paid will not be refunded || Subject to school rules and regulations"));

            document.open();//PDF document opened........

           // document.add(image);
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
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 16);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setPadding(5);
        cell.setHorizontalAlignment(alignment);
        cell.setBorder(PdfPCell.NO_BORDER);
        return cell;
    }

    public static PdfPCell getIRDCell(String text) {
        PdfPCell cell = new PdfPCell(new Paragraph(text));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(5.0f);
        cell.setBorderColor(BaseColor.LIGHT_GRAY);
        return cell;
    }

    public static PdfPCell getBillHeaderCell(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 11);
        font.setColor(BaseColor.GRAY);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(5.0f);
        return cell;
    }

    public static PdfPCell getBillRowCell(String text) {
        PdfPCell cell = new PdfPCell(new Paragraph(text));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(5.0f);
        cell.setBorderWidthBottom(0);
        cell.setBorderWidthTop(0);
        return cell;
    }


    public static PdfPCell getValidityCell(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 10);
        font.setColor(BaseColor.GRAY);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setBorder(0);
        return cell;
    }

    public static PdfPCell getAccountsCell(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 10);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setBorderWidthRight(0);
        cell.setBorderWidthTop(0);
        cell.setPadding(5.0f);
        return cell;
    }

    public static PdfPCell getAccountsCellR(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 10);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setBorderWidthLeft(0);
        cell.setBorderWidthTop(0);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cell.setPadding(5.0f);
        cell.setPaddingRight(20.0f);
        return cell;
    }

    public static PdfPCell getdescCell(String text) {
        FontSelector fs = new FontSelector();
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 10);
        font.setColor(BaseColor.GRAY);
        fs.addFont(font);
        Phrase phrase = fs.process(text);
        PdfPCell cell = new PdfPCell(phrase);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorder(0);
        return cell;
    }
}

