package com.ctecx.argosfims.tenant.students;

import com.ctecx.argosfims.tenant.classess.StudentClass;
import com.ctecx.argosfims.tenant.school.SchoolService;
import com.ctecx.argosfims.tenant.streams.StudentStream;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final SchoolService schoolService;


    @Override
    public Student createStudent(StudentDTO studentDTO) {
        try {
            if (schoolService.searchStudentByAdmission(studentDTO.getAdmissionNumber()).size() > 0) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Admission number already exists: " + studentDTO.getAdmissionNumber()
                );
            }
            Student student = new Student();
            student.setStatus(true);
            mapDTOToStudent(studentDTO, student);
            return studentRepository.save(student);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid enum value: " + e.getMessage()
            );
        }
    }

    // Helper method to map DTO to Student entity
    private void mapDTOToStudent(StudentDTO dto, Student student) {
        try {
            student.setFullName(dto.getFullName());
            student.setAdmissionNumber(dto.getAdmissionNumber());
            student.setGender(dto.getGender());
            student.setLocation(dto.getLocation());


            // Fetch and set the Class entity using SchoolService
            Optional.ofNullable(dto.getClassId())
                    .flatMap(classId -> schoolService.getClassById(classId).stream().findFirst())
                    .ifPresentOrElse(classMap -> {
                                student.setStudentClass(mapClass(classMap));
                            },
                            () -> {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid class ID " + dto.getClassId());
                            }
                    );


            // Fetch and set the Stream entity using SchoolService
            Optional.ofNullable(dto.getStreamId())
                    .flatMap(streamId -> schoolService.getStreamById(streamId).stream().findFirst())
                    .ifPresentOrElse(streamMap -> {
                                student.setStudentStream(mapStream(streamMap));
                            },
                            () -> {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Stream ID " + dto.getStreamId());
                            }
                    );

            student.setStatus(dto.isStatus());

            // Handle enum conversions with validation
            Mode mode = Mode.fromString(dto.getMode().toString());
            student.setMode(mode);

            Admission admission = Admission.fromString(dto.getAdmission().toString());
            student.setAdmission(admission);

            student.setYearOf(Integer.valueOf(String.valueOf(dto.getYearOf())));
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Error mapping student data: " + e.getMessage()
            );
        }
    }

    private StudentClass mapClass(Map<String, Object> classMap) {
        StudentClass studentClass = new StudentClass();
        studentClass.setId((Integer) classMap.get("Id"));
        studentClass.setClassName((String) classMap.get("ClassName"));
        return studentClass;
    }

    private StudentStream mapStream(Map<String, Object> streamMap) {
        StudentStream studentStream = new StudentStream();
        studentStream.setId((Integer) streamMap.get("Id"));
        studentStream.setStreamName((String) streamMap.get("StreamName"));
        return studentStream;
    }

}