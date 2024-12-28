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

}
