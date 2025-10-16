package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.mentoria.domain.Usuario;
import org.mentoria.dto.AuthResponseDTO;
import org.mentoria.dto.request.LoginRequestDTO;
import org.mentoria.dto.request.RegisterRequestDTO;
import io.smallrye.jwt.build.Jwt;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;

@ApplicationScoped
public class AuthService {

    @Inject
    UserService userService;

    public AuthResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        Usuario usuario = userService.createUser(registerRequestDTO);
        String token = generateToken(usuario);
        return new AuthResponseDTO(
                usuario.id,
                usuario.username,
                usuario.email,
                token,
                "Bearer",
                3600L);

    }

    public AuthResponseDTO login(LoginRequestDTO loginDTO) {
        Optional<Usuario> user = userService.findByUsernameOrEmail(loginDTO.identifier());

        if (user.isEmpty()) {
            throw new IllegalArgumentException("Usuario nao encontrado");
        }

        if (!user.get().password.equals(loginDTO.password())) {
            throw new IllegalArgumentException("Senha incorreta");
        }

        String token = generateToken(user.orElse(null));

        return new AuthResponseDTO(
                user.get().id,
                user.get().username,
                user.get().email,
                token,
                "Bearer",
                3600L);
    }

    private String generateToken(Usuario usuario) {
        return Jwt.issuer("mentoria")
                .upn(usuario.email)
                .groups(Set.of("usuario")) // ou "admin"
                .expiresIn(Duration.ofHours(2))
                .sign();
    }

}
