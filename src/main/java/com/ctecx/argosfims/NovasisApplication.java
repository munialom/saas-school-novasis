package com.ctecx.argosfims;

import com.ctecx.argosfims.tenant.dtos.AcknowledgeResponse;
import okhttp3.OkHttpClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class NovasisApplication {

    public static void main(String[] args) {
        SpringApplication.run(NovasisApplication.class, args);
    }

    @Bean
    public OkHttpClient getOkHttpClient() {
        return new OkHttpClient();
    }


    @Bean
    public AcknowledgeResponse getAcknowledgeResponse() {
        AcknowledgeResponse acknowledgeResponse = new AcknowledgeResponse();
        acknowledgeResponse.setMessage("Success");
        return acknowledgeResponse;
    }
}
