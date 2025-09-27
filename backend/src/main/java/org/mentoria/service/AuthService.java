package org.mentoria.service;

import jakarta.inject.Inject;
import org.mentoria.domain.User;
import org.mentoria.dto.AuthResponseDTO;
import org.mentoria.dto.LoginRequestDTO;
import org.mentoria.dto.RegisterRequestDTO;
import org.mentoria.repository.UserRepository;

public class AuthService {
    @Inject
    public UserRepository userRepository;

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
        return "token_" + user.id.toString().replace("-", "");
        
    }

}
