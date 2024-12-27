package com.ctecx.argosfims.tenant.students;

import com.ctecx.argosfims.tenant.classess.StudentClassService;
import com.ctecx.argosfims.tenant.streams.StudentStreamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentClassService studentClassService;
    private final StudentStreamService studentStreamService;

    @Autowired
    public StudentServiceImpl(
            StudentRepository studentRepository,
            StudentClassService studentClassService,
            StudentStreamService studentStreamService) {
        this.studentRepository = studentRepository;
        this.studentClassService = studentClassService;
        this.studentStreamService = studentStreamService;
    }

    @Override
    public Student createStudent(StudentDTO studentDTO) {
        try {
            if (studentRepository.existsByAdmissionNumber(studentDTO.getAdmissionNumber())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Admission number already exists: " + studentDTO.getAdmissionNumber()
                );
            }

            Student student = new Student();
            mapDTOToStudent(studentDTO, student);
            return studentRepository.save(student);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid enum value: " + e.getMessage()
            );
        }
    }

    @Override
    public Student updateStudent(Long id, StudentDTO studentDTO) {
        try {
            Student existingStudent = getStudentById(id);

            if (!existingStudent.getAdmissionNumber().equals(studentDTO.getAdmissionNumber()) &&
                    studentRepository.existsByAdmissionNumber(studentDTO.getAdmissionNumber())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Admission number already exists: " + studentDTO.getAdmissionNumber()
                );
            }

            mapDTOToStudent(studentDTO, existingStudent);
            return studentRepository.save(existingStudent);
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
            student.setStudentClass(studentClassService.getClassById(dto.getClassId()));
            student.setStudentStream(studentStreamService.getStreamById(dto.getStreamId()));
            student.setStatus(dto.isStatus());

            // Handle enum conversions with validation
            Mode mode = Mode.fromString(dto.getMode().toString());
            student.setMode(mode);

            Admission admission = Admission.fromString(dto.getAdmission().toString());
            student.setAdmission(admission);

            student.setYearOf(dto.getYearOf());
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Error mapping student data: " + e.getMessage()
            );
        }
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student not found with id: " + id
                ));
    }

    @Override
    public Student getStudentByAdmissionNumber(String admissionNumber) {
        return studentRepository.findByAdmissionNumber(admissionNumber)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student not found with admission number: " + admissionNumber
                ));
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public List<Student> getStudentsByClass(Integer classId) {
        return studentRepository.findByStudentClassId(classId);
    }

    @Override
    public List<Student> getStudentsByStream(Integer streamId) {
        return studentRepository.findByStudentStreamId(streamId);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    @Override
    public Student toggleStatus(Long id) {
        Student student = getStudentById(id);
        student.setStatus(!student.isStatus());
        return studentRepository.save(student);
    }
}