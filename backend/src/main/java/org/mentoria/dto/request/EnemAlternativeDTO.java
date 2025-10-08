package org.mentoria.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record EnemAlternativeDTO(
        String letter,
        String text,
        boolean isCorrect
) {}