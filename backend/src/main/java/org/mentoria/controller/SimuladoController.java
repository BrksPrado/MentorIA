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


    // GET /simulados/historico/{userId} - Endpoint para histórico do usuário
    @GET
    @Path("/historico/{userId}")
    public Response getHistoricoUsuario(@PathParam("userId") UUID userId) {
        try {
            List<Simulado> historico = simuladoService.findByUsuarioId(userId);
            return Response.ok(historico).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }


    // POST /simulados - Cria um novo simulado (já recebe userId no DTO)
    @POST
    public Response createSimulado(SimuladoDTO simuladoDTO) {
        try {
            Simulado simulado = simuladoService.createSimulado(simuladoDTO);
            // Retorna 201 Created com a localização do novo recurso
            return Response.status(Response.Status.CREATED)
                    .entity(simulado)
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao criar simulado.").build();
        }
    }

    // --- Outros Endpoints ---
    // GET /simulados (Listar todos - talvez restringir para admin?)
    @GET
    public Response getAllSimulados() {
        List<Simulado> simulados = simuladoService.findAll();
        return Response.ok(simulados).build();
    }

    // GET /simulados/{id} (Obter um específico - verificar permissão?)
    @GET
    @Path("/{id}")
    public Response getSimuladoById(@PathParam("id") UUID id) {
        try {
            Simulado simulado = simuladoService.findById(id);
            return Response.ok(simulado).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }

    // PUT /simulados/{id} - Atualiza um simulado (Verificar permissão)
    @PUT
    @Path("/{id}")
    public Response updateSimulado(@PathParam("id") UUID id, SimuladoDTO simuladoDTO) {
        try {
            Simulado simulado = simuladoService.updateSimulado(id, simuladoDTO);
            return Response.ok(simulado).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao atualizar simulado.").build();
        }
    }

    // DELETE /simulados/{id} - Deleta um simulado (Verificar permissão)
    @DELETE
    @Path("/{id}")
    public Response deleteSimulado(@PathParam("id") UUID id) {
        try {
            simuladoService.deleteSimulado(id);
            return Response.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao deletar simulado.").build();
        }
    }

    // Endpoints de média podem precisar ser reavaliados ou adaptados para userId
    // GET /simulados/media
    // GET /simulados/materia/{materiaId}/media
}