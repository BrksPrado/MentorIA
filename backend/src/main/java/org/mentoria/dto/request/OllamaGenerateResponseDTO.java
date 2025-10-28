package org.mentoria.dto.request;

public record OllamaGenerateResponseDTO(
    String model,
    String created_at,
    String response, // Esta é a string de texto gerada pelo modelo
    Boolean done
) {}
