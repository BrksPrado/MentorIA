package org.mentoria.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record SimuladoDTO(
        UUID id,
        UUID materiaId,
        UUID userId,
        Double pontuacao,
        LocalDateTime dataRealizacao,
        String observacoes
) {}