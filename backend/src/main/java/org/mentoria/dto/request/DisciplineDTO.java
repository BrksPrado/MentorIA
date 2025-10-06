package org.mentoria.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DisciplineDTO(
        String label,
        String value
) {}