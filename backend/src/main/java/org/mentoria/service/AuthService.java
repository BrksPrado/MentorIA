package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.mentoria.domain.User;
import org.mentoria.dto.AuthResponseDTO;
import org.mentoria.dto.LoginRequestDTO;
import org.mentoria.dto.RegisterRequestDTO;
import io.smallrye.jwt.build.Jwt;
import org.mentoria.repository.UserRepository;

import java.time.Duration;
import java.util.Set;

@ApplicationScoped
public class AuthService {

    @Inject
    UserService userService;


    public AuthResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        User user = userService.createUser(registerRequestDTO);
        String token = generateToken(user);
        return new AuthResponseDTO(
                user.id,
                user.username,
                user.email,
                token,
                "Bearer",
                3600L
        );

    }

    public AuthResponseDTO login(LoginRequestDTO loginDTO) {
        User user = userService.findByUsernameOrEmail(loginDTO.identifier());

        if (user == null) {
            throw new IllegalArgumentException("Usuario nao encontrado");
        }

        if(!user.password.equals(loginDTO.password())) {
            throw new IllegalArgumentException("Senha incorreta");
        }

        String token = generateToken(user);

        return new AuthResponseDTO(
                user.id,
                user.username,
                user.email,
                token,
                "Bearer",
                3600L
        );
    }

    private String generateToken(User user) {
        return Jwt.issuer("mentoria")
                .upn(user.email)
                .groups(Set.of("user")) // ou "admin"
                .expiresIn(Duration.ofHours(2))
                .sign();
    }


}
