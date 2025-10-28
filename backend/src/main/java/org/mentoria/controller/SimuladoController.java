package org.mentoria.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.domain.Simulado;
import org.mentoria.dto.request.SimuladoDTO;
import org.mentoria.service.SimuladoService;

import java.util.List;
import java.util.UUID;

@Path("/simulados")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SimuladoController {

    @Inject
    SimuladoService simuladoService;

    /**
     * GET /simulados - Lista todos os simulados
     */
    @GET
    public Response getAllSimulados() {
        List<Simulado> simulados = simuladoService.findAll();
        return Response.ok(simulados).build();
    }

    /**
     * GET /simulados/{id} - Obter um simulado específico
     */
    @GET
    @Path("/{id}")
    public Response getSimuladoById(@PathParam("id") UUID id) {
        try {
            Simulado simulado = simuladoService.findById(id);
            return Response.ok(simulado).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    /**
     * GET /simulados/materia/{materiaId} - Lista simulados por matéria
     */
    @GET
    @Path("/materia/{materiaId}")
    public Response getSimuladosByMateria(@PathParam("materiaId") UUID materiaId) {
        try {
            List<Simulado> simulados = simuladoService.findByMateriaId(materiaId);
            return Response.ok(simulados).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    /**
     * GET /simulados/media - Média geral de pontuação
     */
    @GET
    @Path("/media")
    public Response getMediaGeral() {
        Double media = simuladoService.getAveragePontuacao();
        return Response.ok(media).build();
    }

    /**
     * GET /simulados/materia/{materiaId}/media - Média de pontuação por matéria
     */
    @GET
    @Path("/materia/{materiaId}/media")
    public Response getMediaPorMateria(@PathParam("materiaId") UUID materiaId) {
        try {
            Double media = simuladoService.getAveragePontuacaoByMateria(materiaId);
            return Response.ok(media).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    /**
     * POST /simulados - Cria um novo simulado
     */
    @POST
    public Response createSimulado(SimuladoDTO simuladoDTO) {
        try {
            Simulado simulado = simuladoService.createSimulado(simuladoDTO);
            return Response.status(Response.Status.CREATED).entity(simulado).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    /**
     * PUT /simulados/{id} - Atualiza um simulado
     */
    @PUT
    @Path("/{id}")
    public Response updateSimulado(@PathParam("id") UUID id, SimuladoDTO simuladoDTO) {
        try {
            SimuladoDTO dto = new SimuladoDTO(
                    id,
                    simuladoDTO.materiaId(),
                    simuladoDTO.pontuacao(),
                    simuladoDTO.dataRealizacao(),
                    simuladoDTO.observacoes()
            );
            Simulado simulado = simuladoService.updateSimulado(dto);
            return Response.ok(simulado).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    /**
     * DELETE /simulados/{id} - Deleta um simulado
     */
    @DELETE
    @Path("/{id}")
    public Response deleteSimulado(@PathParam("id") UUID id) {
        try {
            simuladoService.deleteSimulado(id);
            return Response.noContent().build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }
}