package org.mentoria.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record EventoListResponseDTO(
        UUID id,
        String titulo,
        String descricao,
        LocalDateTime dataEvento,
        String tipo,
        String cor
) {}