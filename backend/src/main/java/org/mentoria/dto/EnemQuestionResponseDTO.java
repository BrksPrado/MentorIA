package org.mentoria.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.mentoria.dto.request.EnemQuestionDTO;

import java.util.List;


@JsonIgnoreProperties(ignoreUnknown = true)
public record EnemQuestionResponseDTO(
        List<EnemQuestionDTO> questions
) {}