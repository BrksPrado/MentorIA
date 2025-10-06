package org.mentoria.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

// Ignora campos que não vamos usar por agora (ex: title, files, etc.)
@JsonIgnoreProperties(ignoreUnknown = true)
public record EnemQuestionDTO(
        int index, // Correção: era 'id'
        String context, // Correção: era 'statement'
        String discipline, // Correção: era 'area'
        String language,
        int year,
        String correctAlternative,
        String alternativesIntroduction,
        List<EnemAlternativeDTO> alternatives
) {}