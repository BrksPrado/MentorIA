package org.mentoria.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record LanguageDTO(
        String label,
        String value
) {}