package com.ctecx.argosfims.tenant.school;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final CustomSchoolRepository schoolRepository;

    private final ObjectMapper objectMapper;

/*
    public List<Map<String, Object>> GetDashboardStats() {
        return schoolRepository.GetDashboardStats();
    }
*/

    public String getDashboardStats() throws JsonProcessingException {
        List<Map<String, Object>> rawData =  schoolRepository.GetDashboardStats();

        // Check for empty data
        if (rawData == null || rawData.isEmpty()) {
            return "[]"; // Return empty JSON array
        }

        Map<String, Object> dashboardStats = rawData.get(0); // Get the single result

        if (dashboardStats == null){
            return "[]";
        }

        // Format numeric values
        dashboardStats.put("total_students", formatNumber(dashboardStats.get("total_students")));
        dashboardStats.put("session_students", formatNumber(dashboardStats.get("session_students")));
        dashboardStats.put("transfer_students", formatNumber(dashboardStats.get("transfer_students")));
        dashboardStats.put("alumni_students", formatNumber(dashboardStats.get("alumni_students")));
        dashboardStats.put("total_classes", formatNumber(dashboardStats.get("total_classes")));
        dashboardStats.put("total_streams", formatNumber(dashboardStats.get("total_streams")));
        dashboardStats.put("payment_count", formatNumber(dashboardStats.get("payment_count")));
        dashboardStats.put("invoice_count", formatNumber(dashboardStats.get("invoice_count")));

        // Format currency values
        dashboardStats.put("total_payments", formatCurrency(dashboardStats.get("total_payments")));
        dashboardStats.put("total_invoices", formatCurrency(dashboardStats.get("total_invoices")));
        dashboardStats.put("total_balance", formatCurrency(dashboardStats.get("total_balance")));

        // Convert class distribution to actual JSON objects
        String classDistributionString  = (String) dashboardStats.get("class_distribution");
        if (classDistributionString != null && !classDistributionString.isEmpty())
        {
            try {
                List<Map<String, Object>> classDistribution = objectMapper.readValue(classDistributionString, List.class);
                dashboardStats.put("class_distribution", classDistribution);
            }
            catch (JsonProcessingException e){
                //Handle error or leave as string
                System.err.println("Error parsing class distribution JSON:" + e);
            }
        }else{
            dashboardStats.put("class_distribution", null);
        }


        // Convert monthly trends to actual JSON objects
        String monthlyTrendsString  = (String) dashboardStats.get("monthly_trends");

        if (monthlyTrendsString != null && !monthlyTrendsString.isEmpty())
        {
            try {
                List<Map<String, Object>> monthlyTrends = objectMapper.readValue(monthlyTrendsString, List.class);
                dashboardStats.put("monthly_trends", monthlyTrends);
            } catch (JsonProcessingException e) {
                //Handle error or leave as string
                System.err.println("Error parsing monthly trends JSON: " + e);
            }
        }else{
            dashboardStats.put("monthly_trends", null);
        }


        // Convert the result to JSON using ObjectMapper
        String jsonResult = objectMapper.writeValueAsString(List.of(dashboardStats));

        return jsonResult;
    }


    private String formatCurrency(Object value) {
        if (value == null) {
            return "0.00"; // or any default value
        }
        try {
            BigDecimal amount = new BigDecimal(String.valueOf(value));
            // use kenyan shilling format
            DecimalFormat df = new DecimalFormat("#,##0.00");
            return df.format(amount);

        } catch (NumberFormatException e) {
            System.err.println("Error formatting currency:" + e);
            return String.valueOf(value); // return original string if conversion fails
        }
    }

    private Number formatNumber(Object value) {
        if (value == null) {
            return 0; // or any default value
        }
        try {
            return  BigDecimal.valueOf(Double.parseDouble(String.valueOf(value))).intValue();
        }catch (NumberFormatException e){
            System.err.println("Error formatting number: " + e);
            return  0; // return default number if parsing fails
        }

    }



    public Map<String, Object> deleteStudent(int id){
        return schoolRepository.deleteStudent(id);
    }
    public  Map<String, Object> toggleStudentStatus(int id) {
        return schoolRepository.toggleStudentStatus(id);
    }

    public List<Map<String, Object>> searchStudentsWithPagination(String searchTerm, int pageNumber) {
        return Optional.ofNullable(searchTerm)
                .map(term -> schoolRepository.searchStudentsWithPagination(term, pageNumber))
                .orElse(Collections.emptyList());
    }


    public  Map<String, Object> deleteStream(StreamDeleteDTO streamDeleteDTO){
        return Optional.ofNullable(streamDeleteDTO)
                .filter(dto -> dto.getId() != null)
                .map(dto -> schoolRepository.deleteStream(dto.getId()))
                .orElse(Collections.emptyMap());
    }
    public  Map<String, Object> deleteClass(ClassDeleteDTO classDeleteDTO){
        return Optional.ofNullable(classDeleteDTO)
                .filter(dto -> dto.getId() != null)
                .map(dto -> schoolRepository.deleteClass(dto.getId()))
                .orElse(Collections.emptyMap());
    }
    public List<Map<String, Object>> getStudentParents(int id) {
        List<Map<String, Object>> parents = schoolRepository.getStudentParents(id);

        return parents.stream()
                .map(parent -> {
                    String parentDetailsString = (String) parent.get("ParentDetails");

                    if (parentDetailsString != null) {
                        try {
                            //remove backslashes
                            String cleanedString = parentDetailsString.replace("\\", "");
                            Map<String, Object> parentDetails = objectMapper.readValue(cleanedString, Map.class);
                            parent.put("ParentDetails", parentDetails);
                        } catch (JsonProcessingException e) {
                            System.out.println("could not process data "+e); // Log error
                            parent.put("ParentDetails", null);
                        }
                    } else {
                        parent.put("ParentDetails", null);
                    }
                    return parent;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllClasses() {
        return schoolRepository.getAllClasses();
    }

    public List<Map<String, Object>> getAllStreams() {
        return schoolRepository.getAllStreams();
    }

    public List<Map<String, Object>> getAllStudents() {
        return schoolRepository.getAllStudents();
    }

    public void updateClass(ClassUpdateDTO classDTO) {
        Optional.ofNullable(classDTO)
                .filter(dto -> dto.getId() != null)
                .ifPresent(schoolRepository::updateClass);
    }

    public void updateStream(StreamUpdateDTO streamDTO) {
        Optional.ofNullable(streamDTO)
                .filter(dto -> dto.getId() != null)
                .ifPresent(schoolRepository::updateStream);
    }

    public void updateStudent(StudentUpdateDTO studentDTO) {
        Optional.ofNullable(studentDTO)
                .filter(dto -> dto.getId() != null)
                .ifPresent(schoolRepository::updateStudent);
    }


    public List<Map<String, Object>> searchClasses(String searchTerm) {
        return Optional.ofNullable(searchTerm)
                .map(schoolRepository::searchClasses)
                .orElse(Collections.emptyList());
    }

    public List<Map<String, Object>> searchStreams(String searchTerm) {
        return Optional.ofNullable(searchTerm)
                .map(schoolRepository::searchStreams)
                .orElse(Collections.emptyList());
    }

    public List<Map<String, Object>> searchStudentByAdmission(String admission) {
        return Optional.ofNullable(admission)
                .map(schoolRepository::searchStudentByAdmission)
                .orElse(Collections.emptyList());
    }

    public List<Map<String, Object>> searchStudents(String searchTerm) {
        return Optional.ofNullable(searchTerm)
                .map(schoolRepository::searchStudents)
                .orElse(Collections.emptyList());
    }


    public List<Map<String, Object>> filterStudents(StudentFilterDTO filterDTO) {
        return Optional.ofNullable(filterDTO)
                .map(schoolRepository::filterStudents)
                .orElse(Collections.emptyList());
    }

    public List<Map<String, Object>> getStudentById(int id) {
        return schoolRepository.getStudentById(id);
    }

    public List<Map<String, Object>> getStudentByAdmissionNumber(String admissionNumber) {
        return schoolRepository.getStudentByAdmissionNumber(admissionNumber);
    }

    public List<Map<String, Object>> getClassById(int id) {
        return schoolRepository.getClassById(id);
    }

    public List<Map<String, Object>> getStreamById(int id) {
        return schoolRepository.getStreamById(id);
    }

}