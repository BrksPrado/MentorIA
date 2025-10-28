package org.mentoria.dto;

import org.mentoria.dto.request.EnemQuestionDTO;
import java.util.List;

public record QuestionResponse(
        List<EnemQuestionDTO> questions
) {}