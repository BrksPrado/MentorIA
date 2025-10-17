package org.mentoria.dto.request;

import java.util.UUID;

public record MateriaDTO(
        UUID id,
        String nome,
        Integer identificador
) {
}
