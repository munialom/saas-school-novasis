package com.ctecx.argosfims;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class NovasisApplication {

    public static void main(String[] args) {
        SpringApplication.run(NovasisApplication.class, args);
    }

}
