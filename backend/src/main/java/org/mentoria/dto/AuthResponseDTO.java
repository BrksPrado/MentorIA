package org.mentoria.dto;

import java.util.UUID;

public record AuthResponseDTO(
        UUID userId,
        String username,
        String email,
        String token,
        String tokenType,
        Long expiresIn
) {}