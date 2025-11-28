package org.mentoria.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EventoDTO(
        UUID id,
        @NotBlank(message = "Título é obrigatório")
        String titulo,
        String descricao,
        @NotNull(message = "Data do evento é obrigatória")
        LocalDateTime dataEvento,
        @NotBlank(message = "Tipo é obrigatório")
        String tipo,
        String cor,
        @NotNull(message = "ID do usuário é obrigatório")
        UUID userId
) {}