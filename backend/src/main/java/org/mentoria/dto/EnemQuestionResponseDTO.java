package org.mentoria.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.mentoria.dto.request.EnemQuestionDTO;

import java.util.List;

// Ignora outras propriedades que a API possa enviar (como totalPages, etc.)
@JsonIgnoreProperties(ignoreUnknown = true)
public record EnemQuestionResponseDTO(
        List<EnemQuestionDTO> questions // O nome do campo que contém a lista
) {}