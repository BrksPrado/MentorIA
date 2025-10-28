package org.mentoria.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.mentoria.dto.QuestionsContainer;
import org.mentoria.service.OllamaService;

@Path("/ollama")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OllamaController {

    @Inject
    OllamaService ollamaService;

    @GET
    @Path("/test")
    public Response ollamaTest(){
        return Response.ok("Teste").build();
    }

    @GET
    @Path("/get_questions")
    public Response getQuestions(@QueryParam("numberOfQuestions") Integer numberOfQuestions) {
        if (numberOfQuestions == null || numberOfQuestions <= 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("O parâmetro 'numberOfQuestions' é obrigatório e deve ser positivo.")
                           .build();
        }

        // CHAMA O SERVIÇO: Delega a lógica para o OllamaService
        String questionsContainer = ollamaService.gerarQuestoes(numberOfQuestions);
        System.out.println(questionsContainer);

        // Retorna a lista de questões em texto (ou você pode processar para o DTO aqui)
        return Response.ok(questionsContainer).build();
    }
    
}
