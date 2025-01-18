package com.ctecx.argosfims.tenant.reports;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;


@Service
public class CustomReportService {

    @Autowired
    DynamicReportGenerator reportGenerator;

    private ReportMetadata.Builder createBaseMetadata() {
        return new ReportMetadata.Builder()
                .companyName("ArgosFims")
                .companyAddress("Nairobi")
                .telephone("070000000");
    }

    public Path generateCustomReport(List<Map<String, Object>> data,
                                     String filename,
                                     PageOrientation orientation,
                                     Consumer<ReportMetadata.Builder> metadataCustomizer
    ) {
        ReportMetadata.Builder metadataBuilder = createBaseMetadata();
        metadataCustomizer.accept(metadataBuilder);


        try {
            return reportGenerator.generateReport(data, metadataBuilder.build(), filename, orientation);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate report: " + e.getMessage(), e);
        }
    }
}