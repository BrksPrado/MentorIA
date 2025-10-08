package org.mentoria.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record EnemQuestionDTO(
        int index,
        String context,
        String discipline,
        String language,
        int year,
        String correctAlternative,
        String alternativesIntroduction,
        List<EnemAlternativeDTO> alternatives
) {}