package org.mentoria.controller;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.dto.AuthResponseDTO;
import org.mentoria.dto.LoginRequestDTO;
import org.mentoria.dto.RegisterRequestDTO;
import org.mentoria.service.AuthService;

@Path("/auth")
@ApplicationScoped
public class AuthController {

    @Inject
    AuthService authService;


    @POST
    @Path("/register")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response register(RegisterRequestDTO registerDTO) {
        try {
            AuthResponseDTO response = authService.register(registerDTO);
            return Response.status(201).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(400).entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(LoginRequestDTO loginDTO) {
        try {
            AuthResponseDTO response = authService.login(loginDTO);
            return Response.status(200).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(400).entity(e.getMessage()).build();
        }
    }

}
