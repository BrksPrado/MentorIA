package org.mentoria.dto.request;

import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;

public record MateriaDTO(
        UUID id,
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 100, message = "Nome pode ter no máximo 100 caracteres")
        String nome,
        Integer identificador
) {}
