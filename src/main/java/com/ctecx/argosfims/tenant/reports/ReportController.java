package com.ctecx.argosfims.tenant.controllers;


import com.ctecx.argosfims.tenant.classess.StudentClass;
import com.ctecx.argosfims.tenant.classess.StudentClassRepository;
import com.ctecx.argosfims.tenant.finance.CustomFinanceRepository;
import com.ctecx.argosfims.tenant.reports.CustomReportService;
import com.ctecx.argosfims.tenant.reports.PageOrientation;

import com.ctecx.argosfims.tenant.streams.StudentStream;
import com.ctecx.argosfims.tenant.streams.StudentStreamRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportController {

    private final CustomReportService customReportService;
    private final CustomFinanceRepository customFinanceRepository;
    private final StudentClassRepository classRepository;
    private final StudentStreamRepository streamRepository;

    @GetMapping(value = "/students/{classId}/{streamId}/{sessionMode}", produces = MediaType.APPLICATION_PDF_VALUE)
    public void generateStudentReport(
            @PathVariable int classId,
            @PathVariable int streamId,
            @PathVariable String sessionMode,
            HttpServletResponse response) throws IOException {
        List<Map<String, Object>> studentData = customFinanceRepository.sp_GetActiveStudentsByClassStreamAndAdmission(classId, streamId, sessionMode);
        StudentClass studentClass = classRepository.findById(classId).orElse(null);
        StudentStream studentStream = streamRepository.findById(streamId).orElse(null);

        Map<String, String> additionalInfo = new HashMap<>();

        if (studentClass != null) {
            additionalInfo.put("Class Name", studentClass.getClassName());
        }
        if (studentStream != null) {
            additionalInfo.put("Stream Name", studentStream.getStreamName());
        }
        generatePdfResponse(
                studentData,
                "student-report",
                PageOrientation.PORTRAIT,
                builder -> builder
                        .title("Active Student List")
                        .additionalInfo(additionalInfo),
                response
        );
    }

    private void generatePdfResponse(
            List<Map<String, Object>> data,
            String filename,
            PageOrientation orientation,
            Consumer<com.ctecx.argosfims.tenant.reports.ReportMetadata.Builder> metadataCustomizer,
            HttpServletResponse response
    ) throws IOException {
        Path reportPath = customReportService.generateCustomReport(data, filename, orientation, metadataCustomizer);
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename + ".pdf");
        Files.copy(reportPath, response.getOutputStream());
        Files.delete(reportPath);
    }
}