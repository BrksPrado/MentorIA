package org.mentoria.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.domain.Prova;
import org.mentoria.dto.request.ProvaDTO;
import org.mentoria.service.ProvaService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Path("/provas")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProvaController {

    @Inject
    ProvaService provaService;

    @GET
    public Response getAllProvas() {
        List<Prova> provas = provaService.findAll();
        return Response.ok(provas).build();
    }

    @GET
    @Path("/{id}")
    public Response getProvaById(@PathParam("id") UUID id) {
        try {
            Prova prova = provaService.findById(id);
            return Response.ok(prova).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/materia/{materiaId}")
    public Response getProvasByMateria(@PathParam("materiaId") UUID materiaId) {
        try {
            List<Prova> provas = provaService.findByMateriaId(materiaId);
            return Response.ok(provas).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/proximas")
    public Response getUpcomingProvas() {
        List<Prova> provas = provaService.findUpcomingProvas();
        return Response.ok(provas).build();
    }

    @GET
    @Path("/periodo")
    public Response getProvasByPeriodo(
            @QueryParam("dataInicio") String dataInicio,
            @QueryParam("dataFim") String dataFim) {
        try {
            if (dataInicio == null || dataFim == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Parâmetros 'dataInicio' e 'dataFim' são obrigatórios").build();
            }
            LocalDateTime inicio = LocalDateTime.parse(dataInicio);
            LocalDateTime fim = LocalDateTime.parse(dataFim);
            List<Prova> provas = provaService.findByDataBetween(inicio, fim);
            return Response.ok(provas).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        }
    }

    @POST
    public Response createProva(ProvaDTO provaDTO) {
        try {
            Prova prova = provaService.createProva(provaDTO);
            return Response.status(Response.Status.CREATED).entity(prova).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateProva(@PathParam("id") UUID id, ProvaDTO provaDTO) {
        try {
            ProvaDTO dto = new ProvaDTO(id, provaDTO.descricao(), provaDTO.data(), provaDTO.materiaId());
            Prova prova = provaService.updateProva(dto);
            return Response.ok(prova).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deleteProva(@PathParam("id") UUID id) {
        try {
            provaService.deleteProva(id);
            return Response.noContent().build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }
}