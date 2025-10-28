package org.mentoria.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record EnemExamDTO(
        String title,
        int year,
        List<DisciplineDTO> disciplines,
        List<LanguageDTO> languages
) {}