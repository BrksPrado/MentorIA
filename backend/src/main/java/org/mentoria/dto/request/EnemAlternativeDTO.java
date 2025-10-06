package org.mentoria.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// Adicionamos esta anotação para ignorar campos extras como "file"
@JsonIgnoreProperties(ignoreUnknown = true)
public record EnemAlternativeDTO(
        String letter, // Correção: era 'key'
        String text,
        boolean isCorrect // Correção: era 'correct'
) {}