package org.mentoria.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProvaDTO(
        UUID id,
        String descricao,
        LocalDateTime data,
        UUID materiaId
) {}