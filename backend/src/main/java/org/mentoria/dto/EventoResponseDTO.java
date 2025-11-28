package org.mentoria.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record EventoResponseDTO(
        UUID id,
        String titulo,
        String descricao,
        LocalDateTime dataEvento,
        String tipo,
        String cor,
        LocalDateTime dataCriacao,
        LocalDateTime dataAtualizacao,
        UUID usuarioId
) {}