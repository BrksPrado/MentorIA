package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.mentoria.domain.Usuario;
import org.mentoria.dto.request.RegisterRequestDTO;
import org.mentoria.exceptions.UserNotFoundException;
import org.mentoria.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    public Usuario findByUserId(UUID userId) {
        return userRepository.findByIdOptional(userId)
                .orElseThrow(() -> new UserNotFoundException());
    }

    @Transactional
    public Usuario createUser(RegisterRequestDTO registerDTO) {
        userRepository.findByEmail(registerDTO.email())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("Email ja cadastrado");
                });
        userRepository.findByUsername(registerDTO.username())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("Username ja cadastrado");
                });

        Usuario usuario = new Usuario();
        usuario.email = registerDTO.email();
        usuario.username = registerDTO.username();
        usuario.password = registerDTO.password();

        userRepository.persist(usuario);
        return usuario;
    }

    @Transactional
    public Usuario updateUser(UUID userId, Usuario usuario) {
        Usuario findedUsuario = findByUserId(userId);

        if (!findedUsuario.email.equals(usuario.email)) {
            userRepository.findByEmail(usuario.email)
                    .ifPresent(u -> {
                        if (!u.id.equals(userId)) {
                            throw new IllegalArgumentException("Email ja esta em uso");
                        }
                    });
        }

        if (!findedUsuario.username.equals(usuario.username)) {
            userRepository.findByUsername(usuario.username)
                    .ifPresent(u -> {
                        if (!u.id.equals(userId)) {
                            throw new IllegalArgumentException("Username ja esta em uso");
                        }
                    });
        }

        findedUsuario.username = usuario.username;
        findedUsuario.email = usuario.email;

        userRepository.persist(findedUsuario);
        return findedUsuario;
    }

    @Transactional
    public Usuario updatePassword(UUID userId, String newPassword) {
        Usuario usuario = findByUserId(userId);
        usuario.password = newPassword;
        userRepository.persist(usuario);
        return usuario;
    }

    @Transactional
    public void deleteUser(UUID userId) {
        userRepository.delete(findByUserId(userId));
    }

    public Optional<Usuario> findByUsernameOrEmail(String identifier) {
        return userRepository.findByUsernameOrEmail(identifier);
    }
}