package com.booklog.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "BookLog Server API",
        version = "1.0.0",
        description = "API documentation for BookLog application",
        contact = @Contact(
            name = "BookLog Development Team",
            email = "support@booklog.com"
        )
    ),
    servers = {
        @Server(url = "http://localhost:9090/api/v1", description = "Local Development Server")
    }
)
public class SwaggerConfig {
}
