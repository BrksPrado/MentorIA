package org.mentoria.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.dto.EventoListResponseDTO;
import org.mentoria.dto.EventoResponseDTO;
import org.mentoria.dto.request.EventoDTO;
import org.mentoria.service.EventoService;

import java.util.List;
import java.util.UUID;

@Path("/eventos")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EventoController {

    @Inject
    EventoService eventoService;

    @GET
    public Response getAllEventos() {
        List<EventoResponseDTO> eventos = eventoService.findAll();
        return Response.ok(eventos).build();
    }

    @GET
    @Path("/{id}")
    public Response getEventoById(@PathParam("id") UUID id) {
        try {
            EventoResponseDTO evento = eventoService.findById(id);
            return Response.ok(evento).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/usuario/{userId}")
    public Response getEventosByUsuario(@PathParam("userId") UUID userId) {
        try {
            List<EventoListResponseDTO> eventos = eventoService.findByUsuarioId(userId);
            return Response.ok(eventos).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/usuario/{userId}/mes")
    public Response getEventosByMes(
            @PathParam("userId") UUID userId,
            @QueryParam("ano") int ano,
            @QueryParam("mes") int mes) {
        try {
            if (ano == 0 || mes == 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Parâmetros 'ano' e 'mes' são obrigatórios").build();
            }
            List<EventoListResponseDTO> eventos = eventoService.findByUsuarioIdAndMes(userId, ano, mes);
            return Response.ok(eventos).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/usuario/{userId}/proximos")
    public Response getProximosEventos(@PathParam("userId") UUID userId) {
        try {
            List<EventoListResponseDTO> eventos = eventoService.findProximosEventos(userId);
            return Response.ok(eventos).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @POST
    public Response createEvento(EventoDTO eventoDTO) {
        try {
            EventoResponseDTO evento = eventoService.createEvento(eventoDTO);
            return Response.status(Response.Status.CREATED).entity(evento).build();
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
    public Response updateEvento(@PathParam("id") UUID id, EventoDTO eventoDTO) {
        try {
            EventoDTO dto = new EventoDTO(
                    id,
                    eventoDTO.titulo(),
                    eventoDTO.descricao(),
                    eventoDTO.dataEvento(),
                    eventoDTO.tipo(),
                    eventoDTO.cor(),
                    eventoDTO.userId()
            );
            EventoResponseDTO evento = eventoService.updateEvento(dto);
            return Response.ok(evento).build();
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
    public Response deleteEvento(
            @PathParam("id") UUID id,
            @QueryParam("userId") UUID userId) {
        try {
            if (userId == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("userId é obrigatório").build();
            }
            eventoService.deleteEvento(id, userId);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(e.getMessage()).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }
}