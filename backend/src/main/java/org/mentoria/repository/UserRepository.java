package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.domain.Usuario;
import org.mentoria.exceptions.UserNotFoundException;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserRepository implements PanacheRepository<Usuario> {

    public Usuario findByUserId(UUID userId) {
        return (Usuario) Usuario.findByIdOptional(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    public Optional<Usuario> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }


    public Optional<Usuario> findByUsername(String username) {
        return find("username", username).firstResultOptional();
    }

    public Optional<Usuario> findByUsernameOrEmail(String identifier) {
        return find("username = ?1 OR email = ?1", identifier).firstResultOptional();
    }
}