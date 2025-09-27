package org.mentoria.config;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.info.Info;

@ApplicationScoped
@OpenAPIDefinition(
        info = @Info(
                title = "MentorIA API",
                version = "1.0.0",
                description = "Documentação da API MentorIA"
        )
)
public class OpenApiConfig {
    // Pode ser expandido com tags ou servidores se necessário
}