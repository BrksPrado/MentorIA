package org.mentoria.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

public record SimuladoDTO(
        @JsonProperty("id")
        UUID id,

        @JsonProperty("materiaId")
        UUID materiaId,

        @JsonProperty("userId")
        UUID userId,

        @JsonProperty("pontuacao")
        Double pontuacao,

        @JsonProperty("dataRealizacao")
        LocalDateTime dataRealizacao,

        @JsonProperty("observacoes")
        String observacoes,

        @JsonProperty("acertos")
        Integer acertos,

        @JsonProperty("totalQuestoes")
        Integer totalQuestoes
) {}