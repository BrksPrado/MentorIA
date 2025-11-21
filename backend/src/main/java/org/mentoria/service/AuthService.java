package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.mentoria.domain.Usuario;
import org.mentoria.dto.AuthResponseDTO;
import org.mentoria.dto.request.LoginRequestDTO;
import org.mentoria.dto.request.RegisterRequestDTO;

import java.util.Optional;


@ApplicationScoped
public class AuthService {

    @Inject
    UserService userService;

    public AuthResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        Usuario usuario = userService.createUser(registerRequestDTO);
        return new AuthResponseDTO(
                usuario.id,
                usuario.username,
                usuario.email)
                ;

    }

    public AuthResponseDTO login(LoginRequestDTO loginDTO) {
        Optional<Usuario> user = userService.findByUsernameOrEmail(loginDTO.identifier());

        if (user.isEmpty()) {
            throw new IllegalArgumentException("Usuario nao encontrado");
        }

        if (!user.get().password.equals(loginDTO.password())) {
            throw new IllegalArgumentException("Senha incorreta");
        }


        return new AuthResponseDTO(
                user.get().id,
                user.get().username,
                user.get().email
        );
    }



}
