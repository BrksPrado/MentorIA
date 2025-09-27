package org.mentoria.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.domain.User;
import org.mentoria.dto.AuthResponseDTO;
import org.mentoria.service.UserService;

import java.util.UUID;

@Path("/users")
@ApplicationScoped
public class UserController {

    @Inject
    UserService userService;

    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("userId") UUID userId) {
        try {
            User response = userService.findByUserId(userId);
            return Response.status(201).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(400).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public User updateUser(@PathParam("userId") UUID userId, User user) {
        return userService.updateUser(userId, user);
    }

    @DELETE
    @Path("/{userId}")
    public Response deleteUser(@PathParam("userId") UUID userId) {
        userService.deleteUser(userId);
        return Response.noContent().build();
    }
}