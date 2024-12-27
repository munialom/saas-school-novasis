package com.ctecx.argosfims.util;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected org.springframework.core.io.Resource getResource(String resourcePath,
                                                                               org.springframework.core.io.Resource location) throws IOException {
                        if (resourcePath.startsWith("/api") || resourcePath.startsWith("/auth") )
                            return null;
                        org.springframework.core.io.Resource requestedResource = location.createRelative(resourcePath);
                        return requestedResource.exists() ? requestedResource : new ClassPathResource("/static/index.html");
                    }
                });
    }
}