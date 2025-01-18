package com.ctecx.argosfims.tenant.reports;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

@Service
public class DynamicReportGenerator {
    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(52, 152, 219);
    private static final DeviceRgb ALTERNATE_ROW_COLOR = new DeviceRgb(240, 240, 240);
    private static final DeviceRgb BORDER_COLOR = new DeviceRgb(169, 169, 169);
    private static final float DEFAULT_FONT_SIZE = 7f;
    private static final float TITLE_FONT_SIZE = 12f;
    private static final float COMPANY_FONT_SIZE = 10f;
    private static final float ADDRESS_FONT_SIZE = 8f;
    private static final float MARGIN_TOP = 70f;
    private static final float MARGIN_BOTTOM = 50f;
    private static final float MARGIN_LEFT = 30f;
    private static final float MARGIN_RIGHT = 30f;
    private static final String ROW_NUMBER_COLUMN = "No.";
    private static final float HEADER_SPACING = 2f;
    private static final float HEADER_TOP_PADDING = 15f;
    private static final float CELL_PADDING = 3f;

    private enum ColumnType {
        ID, NUMERIC, TEXT, ROW_NUMBER
    }

    public Path generateReport(List<Map<String, Object>> reportData, ReportMetadata metadata, String outputFilename, PageOrientation orientation) {
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
        Path outputPath = tempDir.resolve(outputFilename);
        try {
            List<String> orderedHeaders = determineColumnOrder(reportData);
            orderedHeaders.add(0, ROW_NUMBER_COLUMN);
            createPDF(outputPath.toString(), reportData, orderedHeaders, metadata, orientation);
            return outputPath;
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate report", e);
        }
    }

    private List<String> determineColumnOrder(List<Map<String, Object>> data) {
        if (data.isEmpty()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(data.get(0).keySet());
    }

    private void createPDF(String filename, List<Map<String, Object>> data, List<String> orderedHeaders, ReportMetadata metadata, PageOrientation orientation) throws IOException {
        PageSize pageSize = orientation == PageOrientation.PORTRAIT ? PageSize.A4 : PageSize.A4.rotate();
        try (PdfWriter writer = new PdfWriter(filename);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf, pageSize)) {
            document.setMargins(MARGIN_TOP, MARGIN_RIGHT, MARGIN_BOTTOM, MARGIN_LEFT);
            pdf.addEventHandler(PdfDocumentEvent.END_PAGE, new HeaderFooterEventHandler(metadata));
            Table table = createTable(data, orderedHeaders);
            document.add(table);
        }
    }

    private Table createTable(List<Map<String, Object>> data, List<String> headers) {
        float[] columnWidths = calculateColumnWidths(headers, data);
        Table table = new Table(UnitValue.createPointArray(columnWidths))
                .useAllAvailableWidth()
                .setBorder(new com.itextpdf.layout.borders.SolidBorder(BORDER_COLOR, 0.5f));

        // Table Header
        headers.forEach(header -> {
            String modifiedHeader = header.replace("_", " ");
            Cell cell = new Cell()
                    .add(new Paragraph(modifiedHeader).setFontSize(DEFAULT_FONT_SIZE))
                    .setBackgroundColor(HEADER_COLOR)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE)
                    .setPadding(CELL_PADDING)
                    .setBorder(new com.itextpdf.layout.borders.SolidBorder(BORDER_COLOR, 0.5f));
            table.addHeaderCell(cell);
        });

        Map<String, ColumnType> columnTypes = determineColumnTypes(headers, data);
        columnTypes.put(ROW_NUMBER_COLUMN, ColumnType.ROW_NUMBER);

        IntStream.range(0, data.size())
                .forEach(i -> addRowToTable(table, data.get(i), headers, columnTypes, i + 1, i % 2 == 1));

        return table;
    }

    private float[] calculateColumnWidths(List<String> headers, List<Map<String, Object>> data) {
        Map<String, Integer> maxLengths = new HashMap<>();
        maxLengths.put(ROW_NUMBER_COLUMN, 4);

        headers.stream()
                .filter(header -> !header.equals(ROW_NUMBER_COLUMN))
                .forEach(header -> maxLengths.put(header, header.length()));

        data.forEach(row -> headers.stream()
                .filter(header -> !header.equals(ROW_NUMBER_COLUMN))
                .forEach(header -> {
                    Object value = row.get(header);
                    int length = value == null ? 0 : value.toString().length();
                    maxLengths.put(header, Math.max(maxLengths.get(header), length));
                }));

        float[] widths = new float[headers.size()];
        float totalWidth = maxLengths.values().stream().mapToInt(Integer::intValue).sum();

        for (int i = 0; i < headers.size(); i++) {
            String header = headers.get(i);
            if (header.equals(ROW_NUMBER_COLUMN)) {
                widths[i] = 20f;
            } else {
                float percentage = maxLengths.get(header) / totalWidth;
                widths[i] = Math.max(30f, Math.min(120f, percentage * 500));
            }
        }
        return widths;
    }

    private Map<String, ColumnType> determineColumnTypes(List<String> headers, List<Map<String, Object>> data) {
        Map<String, ColumnType> columnTypes = new HashMap<>();

        for (String header : headers) {
            if (header.equals(ROW_NUMBER_COLUMN)) {
                continue;
            }

            boolean allNumeric = true;
            boolean allId = true;

            for (Map<String, Object> row : data) {
                Object value = row.get(header);
                if (value != null) {
                    String strValue = value.toString().trim();
                    if (!isNumeric(strValue)) allNumeric = false;
                    if (!strValue.matches("\\d+")) allId = false;
                }
            }

            if (allId && header.toLowerCase().matches(".*(id|no|code).*")) {
                columnTypes.put(header, ColumnType.ID);
            } else if (allNumeric) {
                columnTypes.put(header, ColumnType.NUMERIC);
            } else {
                columnTypes.put(header, ColumnType.TEXT);
            }
        }
        return columnTypes;
    }

    private boolean isNumeric(String strValue) {
        if (strValue.matches("-?\\d+(\\.\\d+)?")) return true;
        return strValue.matches("-?\\d{1,3}(,\\d{3})*(\\.\\d+)?");
    }

    private void addRowToTable(Table table, Map<String, Object> row, List<String> headers, Map<String, ColumnType> columnTypes, int rowNumber, boolean alternate) {

        headers.forEach(header -> {
            Cell cell;
            if (header.equals(ROW_NUMBER_COLUMN)) {
                cell = new Cell()
                        .add(new Paragraph(String.valueOf(rowNumber)).setFontSize(DEFAULT_FONT_SIZE))
                        .setTextAlignment(TextAlignment.CENTER)
                        .setVerticalAlignment(VerticalAlignment.MIDDLE)
                        .setPadding(CELL_PADDING)
                        .setBorder(new com.itextpdf.layout.borders.SolidBorder(BORDER_COLOR, 0.5f));
            } else {
                Object value = row.get(header);
                String cellValue;
                TextAlignment alignment;

                switch (columnTypes.get(header)) {
                    case ID:
                        cellValue = value != null ? String.valueOf(value) : "";
                        alignment = TextAlignment.CENTER;
                        break;
                    case NUMERIC:
                        cellValue = value != null ? String.valueOf(value) : "";
                        alignment = TextAlignment.RIGHT;
                        break;
                    default:
                        cellValue = value != null ? String.valueOf(value) : "";
                        alignment = TextAlignment.LEFT;
                }

                cell = new Cell()
                        .add(new Paragraph(cellValue).setFontSize(DEFAULT_FONT_SIZE))
                        .setTextAlignment(alignment)
                        .setVerticalAlignment(VerticalAlignment.MIDDLE)
                        .setPadding(CELL_PADDING)
                        .setBorder(new com.itextpdf.layout.borders.SolidBorder(BORDER_COLOR, 0.5f));
            }

            if (alternate) {
                cell.setBackgroundColor(ALTERNATE_ROW_COLOR);
            }

            table.addCell(cell);
        });
    }

    private class HeaderFooterEventHandler implements IEventHandler {
        private final ReportMetadata metadata;

        public HeaderFooterEventHandler(ReportMetadata metadata) {
            this.metadata = metadata;
        }

        @Override
        public void handleEvent(Event event) {
            PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
            PdfDocument pdf = docEvent.getDocument();
            PdfPage page = docEvent.getPage();
            Rectangle pageSize = page.getPageSize();
            PdfCanvas pdfCanvas = new PdfCanvas(page);

            try (Canvas canvas = new Canvas(pdfCanvas, pageSize)) {
                float yOffset = pageSize.getTop() - HEADER_TOP_PADDING;


                // Company Name - Centered
                Paragraph companyName = new Paragraph(metadata.companyName())
                        .setFontSize(COMPANY_FONT_SIZE).setBold()
                        .setTextAlignment(TextAlignment.CENTER);  // Added center alignment
                canvas.showTextAligned(companyName, pageSize.getWidth() / 2, yOffset, TextAlignment.CENTER);

                yOffset -= COMPANY_FONT_SIZE + 2; // move down after title

                // Company Address and Telephone  - centered
                Paragraph companyAddress = new Paragraph(metadata.companyAddress() + " - " + metadata.telephone())
                        .setFontSize(ADDRESS_FONT_SIZE)
                        .setTextAlignment(TextAlignment.CENTER); //set alignment to center
                canvas.showTextAligned(companyAddress, pageSize.getWidth()/2, yOffset, TextAlignment.CENTER); //center on x-axis


                // Report Title - centered
                yOffset -= ADDRESS_FONT_SIZE + 5;
                canvas.showTextAligned(new Paragraph(metadata.title())
                                .setFontSize(TITLE_FONT_SIZE)
                                .setBold(),
                        pageSize.getWidth() / 2, yOffset, TextAlignment.CENTER);


                // Additional Info in single line
                if (metadata.additionalInfo() != null && !metadata.additionalInfo().isEmpty()) {
                    yOffset -= TITLE_FONT_SIZE + 5;

                    StringBuilder sb = new StringBuilder();
                    for (Map.Entry<String, String> entry : metadata.additionalInfo().entrySet()) {
                        sb.append(entry.getKey()).append(": ").append(entry.getValue()).append("   ");
                    }

                    Paragraph additionalInfo = new Paragraph(sb.toString())
                            .setFontSize(ADDRESS_FONT_SIZE);

                    canvas.showTextAligned(additionalInfo, MARGIN_LEFT, yOffset, TextAlignment.LEFT);

                }


                float footerY = pageSize.getBottom() + 30;

                // Line above footer
                pdfCanvas.setStrokeColor(ColorConstants.LIGHT_GRAY)
                        .setLineWidth(0.5f)
                        .moveTo(MARGIN_LEFT, footerY - 10)
                        .lineTo(pageSize.getWidth() - MARGIN_RIGHT, footerY - 10)
                        .stroke();

                // Current Time
                String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                canvas.showTextAligned(new Paragraph("Generated on: " + currentTime)
                                .setFontSize(DEFAULT_FONT_SIZE),
                        MARGIN_LEFT, footerY - 20, TextAlignment.LEFT);

                // Page Info
                String pageInfo = String.format("Page %d of %d", pdf.getPageNumber(page), pdf.getNumberOfPages());
                canvas.showTextAligned(new Paragraph(pageInfo)
                                .setFontSize(DEFAULT_FONT_SIZE),
                        pageSize.getWidth() - MARGIN_RIGHT, footerY - 20, TextAlignment.RIGHT);
            }
        }
    }
}