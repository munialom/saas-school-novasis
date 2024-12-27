package com.ctecx.argosfims.tenant.streams;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class StudentStreamServiceImpl implements StudentStreamService {
    private final StudentStreamRepository studentStreamRepository;

    @Autowired
    public StudentStreamServiceImpl(StudentStreamRepository studentStreamRepository) {
        this.studentStreamRepository = studentStreamRepository;
    }

    @Override
    public StudentStream createStream(StudentStream studentStream) {
        return studentStreamRepository.save(studentStream);
    }

    @Override
    public StudentStream updateStream(Integer id, StudentStream studentStream) {
        StudentStream existingStream = getStreamById(id);
        existingStream.setStreamName(studentStream.getStreamName());
        existingStream.setStatus(studentStream.isStatus());
        return studentStreamRepository.save(existingStream);
    }

    @Override
    public StudentStream getStreamById(Integer id) {
        return studentStreamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stream not found with id: " + id));
    }

    @Override
    public List<StudentStream> getAllStreams() {
        return studentStreamRepository.findAll();
    }

    @Override
    public void deleteStream(Integer id) {
        StudentStream studentStream = getStreamById(id);
        studentStreamRepository.delete(studentStream);
    }

    @Override
    public StudentStream toggleStatus(Integer id) {
        StudentStream studentStream = getStreamById(id);
        studentStream.setStatus(!studentStream.isStatus());
        return studentStreamRepository.save(studentStream);
    }
}
