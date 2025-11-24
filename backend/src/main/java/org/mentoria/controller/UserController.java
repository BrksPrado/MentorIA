package org.mentoria.controller;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mentoria.domain.Usuario;
import org.mentoria.dto.request.ChangePasswordDTO;
import org.mentoria.service.SimuladoService;
import org.mentoria.service.UserService;

import java.util.UUID;

@Path("/users")
@ApplicationScoped
public class UserController {

    @Inject
    UserService userService;

    @Inject
    SimuladoService simuladoService;

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

    @PUT
    @Path("/{userId}/password")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changePassword(@PathParam("userId") UUID userId,
                                   ChangePasswordDTO request) {

        System.out.println("🔐 Recebendo solicitação de alteração de senha para usuário: " + userId);

        // 1. Validar se o usuário existe
        Usuario user = userService.findByUserId(userId);
        if (user == null) {
            System.out.println("❌ Usuário não encontrado: " + userId);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"message\": \"Usuário não encontrado\"}")
                    .build();
        }

        // 2. Verificar se a senha atual está correta
        if (!user.getPassword().equals(request.getCurrentPassword())) {
            System.out.println("❌ Senha atual incorreta");
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\": \"Senha atual incorreta\"}")
                    .build();
        }

        // 3. Validar que a nova senha é diferente da atual
        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            System.out.println("❌ Nova senha deve ser diferente da atual");
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\": \"A nova senha deve ser diferente da senha atual\"}")
                    .build();
        }

        // 4. Salvar a nova senha usando o método específico
        System.out.println("💾 Salvando nova senha...");
        userService.updatePassword(userId, request.getNewPassword());

        System.out.println("✅ Senha alterada com sucesso para usuário: " + userId);

        return Response.ok()
                .entity("{\"message\": \"Senha alterada com sucesso\", \"success\": true}")
                .build();
    }

    @DELETE
    @Path("/{userId}")
    public Response deleteUser(@PathParam("userId") UUID userId) {
        simuladoService.deleteSimuladosByUserId(userId);
        userService.deleteUser(userId);
        return Response.noContent().build();
    }
}