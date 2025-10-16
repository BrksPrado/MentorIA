package org.mentoria.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.domain.Usuario;
import org.mentoria.service.UserService;

import java.util.UUID;

@Path("/users")
@ApplicationScoped
// @RolesAllowed("user")
public class UserController {

    @Inject
    UserService userService;

    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Usuario getUser(@PathParam("userId") UUID userId) {
        return userService.findByUserId(userId);
    }

    @PUT
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Usuario updateUser(@PathParam("userId") UUID userId, Usuario usuario) {
        return userService.updateUser(userId, usuario);
    }

    @DELETE
    @Path("/{userId}")
    public Response deleteUser(@PathParam("userId") UUID userId) {
        userService.deleteUser(userId);
        return Response.noContent().build();
    }
}