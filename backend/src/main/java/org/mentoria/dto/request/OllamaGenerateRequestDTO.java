package org.mentoria.dto.request;

public record OllamaGenerateRequestDTO(
    String model,     // Ex: "llama3" ou "mistral"
    String prompt,    // O texto principal que você quer que o LLM processe
    Boolean stream   // Se a resposta deve ser enviada em partes (streaming)
) {}