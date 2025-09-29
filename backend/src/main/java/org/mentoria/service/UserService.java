package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.mentoria.domain.User;
import org.mentoria.dto.AuthResponseDTO;
import org.mentoria.dto.RegisterRequestDTO;
import org.mentoria.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    public User findByUserId(UUID userId) {
        return userRepository.findByUserId(userId);
    }


    @Transactional
    public User createUser(RegisterRequestDTO registerDTO) {
        userRepository.findByEmail(registerDTO.email())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("Email ja cadastrado");
                });
        userRepository.findByUsername(registerDTO.username())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("Username ja cadastrado");
                });

        User user = new User();
        user.email = registerDTO.email();
        user.username = registerDTO.username();
        user.password = registerDTO.password();

        userRepository.persist(user);
        return user;
    }


    @Transactional
    public User updateUser(UUID userId, User user) {
        User findedUser = findByUserId(userId);

        if (!findedUser.email.equals(user.email)) {
            userRepository.findByEmail(user.email)
                    .ifPresent(u -> {
                        if (!u.id.equals(userId)) {
                            throw new IllegalArgumentException("Email ja esta em uso");
                        }
                    });
        }

        if (!findedUser.username.equals(user.username)) {
            userRepository.findByUsername(user.username)
                    .ifPresent(u -> {
                        if (!u.id.equals(userId)) {
                            throw new IllegalArgumentException("Username ja esta em uso");
                        }
                    });
        }

        findedUser.username = user.username;
        findedUser.email = user.email;

        userRepository.persist(findedUser);
        return findedUser;
    }

    @Transactional
    public void deleteUser(UUID userId) {
        userRepository.delete(findByUserId(userId));
    }


    public Optional<User> findByUsernameOrEmail(String identifier) {
        return userRepository.findByUsernameOrEmail(identifier);
    }
}
