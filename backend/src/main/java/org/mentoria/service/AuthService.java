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
import java.util.UUID;

@ApplicationScoped
public class AuthService {

    @Inject
    UserService userService;

    public AuthResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        Usuario usuario = userService.createUser(registerRequestDTO);
        String token = generateToken(usuario);
        return new AuthResponseDTO(
                usuario.id,  // ← Converte UUID para String
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

        String token = generateToken(user.get());

        return new AuthResponseDTO(
                user.get().id,  // ← Converte UUID para String
                user.get().username,
                user.get().email,
                token,
                "Bearer",
                3600L);
    }

    /**
     * Gera o JWT com informações úteis
     */
    private String generateToken(Usuario usuario) {
        String token = Jwt.issuer("mentoria")
                .subject(usuario.id.toString())  // ← 'sub' contém o UUID do usuário
                .upn(usuario.email)              // ← 'upn' (User Principal Name)
                .claim("userId", usuario.id.toString())     // ← ID do usuário
                .claim("username", usuario.username)         // ← Nome de usuário
                .claim("email", usuario.email)               // ← Email
                .groups(Set.of("usuario"))                   // ← Grupo (para autorização)
                .expiresIn(Duration.ofHours(2))
                .sign();

        System.out.println("Token gerado para usuário: " + usuario.username);
        return token;
    }
}