package org.mentoria.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.service.QuizService;

@Path("/quizzes")
@Produces(MediaType.APPLICATION_JSON)
public class QuizController {

    @Inject
    QuizService quizService;

    // Endpoint para listar os anos disponíveis
    @GET
    @Path("/exams")
    public Response getExams() {
        var years = quizService.getAvailableExams();
        return Response.ok(years).build();
    }

    // Endpoint para a prova de um ano inteiro
    @GET
    @Path("/full-exam-by-year")
    public Response getFullQuizByYear(@QueryParam("year") int year) {
        if (year == 0) {
            return Response.status(Response.Status.BAD_REQUEST).entity("O parâmetro 'year' é obrigatório.").build();
        }
        var questions = quizService.getFullQuiz(year);
        return Response.ok(questions).build();
    }

    // Endpoint para a prova de um ano, filtrada por matéria
    @GET
    @Path("/questions-by-area")
    public Response getQuestionsByArea(
            @QueryParam("year") int year,
            @QueryParam("area") String area) {

        if (year == 0 || area == null || area.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Os parâmetros 'year' e 'area' são obrigatórios.").build();
        }
        var questions = quizService.getQuizByArea(year, area);
        return Response.ok(questions).build();
    }
}