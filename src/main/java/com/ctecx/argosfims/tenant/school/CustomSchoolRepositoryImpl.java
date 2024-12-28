package com.ctecx.argosfims.tenant.school;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import com.ctecx.argosfims.tenant.config.TenantJdbcTemplateConfig;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CustomSchoolRepositoryImpl implements CustomSchoolRepository {

    private final TenantJdbcTemplateConfig tenantJdbcTemplateConfig;

    private JdbcTemplate getJdbcTemplate(){
        return tenantJdbcTemplateConfig.getTenantJdbcTemplate();
    }


    @Override
    public List<Map<String, Object>> getStudentParents(int id) {

        return getJdbcTemplate().queryForList("CALL GetStudentParents(?)", id);
    }

    @Override
    public List<Map<String, Object>> getAllClasses() {
        return getJdbcTemplate().queryForList("CALL sp_GetClasses()");
    }

    @Override
    public List<Map<String, Object>> getAllStreams() {
        return getJdbcTemplate().queryForList("CALL sp_GetStreams()");
    }

    @Override
    public List<Map<String, Object>> getAllStudents() {
        return getJdbcTemplate().queryForList("CALL sp_GetStudents()");
    }

    @Override
    public void updateClass(ClassUpdateDTO classDTO) {
        getJdbcTemplate().update("CALL sp_UpdateClass(?, ?, ?)",
                classDTO.getId(),
                classDTO.getClassName(),
                Optional.ofNullable(classDTO.getStatus())
                        .map(status -> status ? 1 : 0)
                        .orElse(null)
        );
    }

    @Override
    public void updateStream(StreamUpdateDTO streamDTO) {
        getJdbcTemplate().update("CALL sp_UpdateStream(?, ?, ?)",
                streamDTO.getId(),
                streamDTO.getStreamName(),
                Optional.ofNullable(streamDTO.getStatus())
                        .map(status -> status ? 1 : 0)
                        .orElse(null)
        );
    }

    @Override
    public void updateStudent(StudentUpdateDTO studentDTO) {
        getJdbcTemplate().update("CALL sp_UpdateStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                studentDTO.getId(),
                studentDTO.getAdmissionNumber(),
                studentDTO.getFullName(),
                studentDTO.getGender(),
                studentDTO.getLocation(),
                studentDTO.getAdmission(),
                studentDTO.getMode(),
                Optional.ofNullable(studentDTO.getStatus())
                        .map(status -> status ? 1 : 0)
                        .orElse(null),
                studentDTO.getYearOf(),
                studentDTO.getClassId(),
                studentDTO.getStreamId()
        );
    }



    @Override
    public List<Map<String, Object>> searchClasses(String searchTerm) {
        return getJdbcTemplate().queryForList("CALL sp_SearchClasses(?)", searchTerm);
    }

    @Override
    public List<Map<String, Object>> searchStreams(String searchTerm) {
        return getJdbcTemplate().queryForList("CALL sp_SearchStreams(?)", searchTerm);
    }

    @Override
    public List<Map<String, Object>> searchStudentByAdmission(String admission) {
        return getJdbcTemplate().queryForList("CALL sp_SearchStudentByAdmission(?)", admission);
    }

    @Override
    public List<Map<String, Object>> searchStudents(String searchTerm) {
        return getJdbcTemplate().queryForList("CALL sp_SearchStudents(?)", searchTerm);
    }

    @Override
    public List<Map<String, Object>> filterStudents(StudentFilterDTO filterDTO) {
        return getJdbcTemplate().queryForList("CALL sp_FilterStudents(?, ?, ?, ?, ?, ?)",
                filterDTO.getClassName(),
                filterDTO.getStreamName(),
                Optional.ofNullable(filterDTO.getStatus())
                        .map(status -> status ? 1 : 0)
                        .orElse(null),
                filterDTO.getYearOf(),
                filterDTO.getAdmission(),
                filterDTO.getMode()
        );
    }

    @Override
    public List<Map<String, Object>> getStudentById(int id) {
        return getJdbcTemplate().queryForList("CALL sp_GetStudentById(?)", id);
    }

    @Override
    public List<Map<String, Object>> getStudentByAdmissionNumber(String admissionNumber) {
        return getJdbcTemplate().queryForList("CALL sp_GetStudentByAdmissionNumber(?)", admissionNumber);
    }

    @Override
    public List<Map<String, Object>> getClassById(int id) {
        return getJdbcTemplate().queryForList("CALL sp_GetClassById(?)", id);
    }

    @Override
    public List<Map<String, Object>> getStreamById(int id) {
        return getJdbcTemplate().queryForList("CALL sp_GetStreamById(?)", id);
    }
}