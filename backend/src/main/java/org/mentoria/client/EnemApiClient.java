package org.mentoria.client;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.mentoria.dto.EnemQuestionResponseDTO;
import org.mentoria.dto.request.EnemExamDTO; // Importar o novo DTO

import java.util.List;

@Path("/v1")
@RegisterRestClient(configKey="enem-api")
@Produces(MediaType.APPLICATION_JSON)
public interface EnemApiClient {

    @GET
    @Path("/exams")
    List<EnemExamDTO> getAvailableExams();

    @GET
    @Path("/exams/{year}/questions")
    EnemQuestionResponseDTO getExamByYear(
            @PathParam("year") int year,
            @QueryParam("limit") int limit,
            @QueryParam("offset") int offset
    );


}