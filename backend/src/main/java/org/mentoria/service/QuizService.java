package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.mentoria.client.EnemApiClient;
import org.mentoria.dto.EnemQuestionResponseDTO;
import org.mentoria.dto.request.EnemExamDTO;
import org.mentoria.dto.request.EnemQuestionDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizService {

    @Inject
    @RestClient
    EnemApiClient enemApiClient;

    // Método para o Controller chamar os anos disponíveis
    public List<EnemExamDTO> getAvailableExams() {
        return enemApiClient.getAvailableExams();
    }

    // Método privado que busca a prova inteira de um ano, com paginação
    private List<EnemQuestionDTO> fetchFullQuizByYear(int year) {
        List<EnemQuestionDTO> allQuestions = new ArrayList<>();
        int limit = 50;
        int offset = 1;
        boolean hasMore = true;

        while (hasMore) {
            EnemQuestionResponseDTO response = enemApiClient.getExamByYear(year, limit, offset);
            if (response != null && response.questions() != null && !response.questions().isEmpty()) {
                allQuestions.addAll(response.questions());
                offset += limit;
            } else {
                hasMore = false;
            }
        }
        return allQuestions;
    }

    // Método para o Controller chamar a prova inteira
    public List<EnemQuestionDTO> getFullQuiz(int year) {
        return fetchFullQuizByYear(year);
    }

    // Método para o Controller chamar a prova filtrada por matéria
    public List<EnemQuestionDTO> getQuizByArea(int year, String area) {
        List<EnemQuestionDTO> fullQuiz = fetchFullQuizByYear(year);

        return fullQuiz.stream()
                .filter(question -> area.equalsIgnoreCase(question.discipline()))
                .collect(Collectors.toList());
    }
}
