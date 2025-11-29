package org.mentoria.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.domain.Materia;
import org.mentoria.dto.request.MateriaDTO;
import org.mentoria.service.MateriaService;

import java.util.List;
import java.util.UUID;

@Path("/materias")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MateriaController {

    @Inject
    MateriaService materiaService;

    @GET
    public Response getAllMaterias() {
        List<Materia> materias = materiaService.findAll();
        return Response.ok(materias).build();
    }

    @GET
    @Path("/{id}")
    public Response getMateriaById(@PathParam("id") UUID id) {
        try {
            Materia materia = materiaService.findById(id);
            return Response.ok(materia).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }

    @POST
    public Response createMateria(MateriaDTO materiaDTO) {
        try {
            Materia materia = materiaService.createMateria(materiaDTO);
            return Response.status(Response.Status.CREATED).entity(materia).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateMateria(@PathParam("id") UUID id, MateriaDTO materiaDTO) {
        try {
            MateriaDTO dto = new MateriaDTO(id, materiaDTO.nome(), materiaDTO.identificador());
            Materia materia = materiaService.updateMateria(dto);
            return Response.ok(materia).build();
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
    public Response deleteMateria(@PathParam("id") UUID id) {
        try {
            materiaService.deleteMateriaById(id);
            return Response.noContent().build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        }
    }
}