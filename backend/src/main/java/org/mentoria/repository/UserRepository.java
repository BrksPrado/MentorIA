package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.exceptions.UserNotFoundException;
import org.mentoria.domain.User;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public User findByUserId(UUID userId) {
        return (User) User.findByIdOptional(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    public Optional<User> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }


    public Optional<User> findByUsername(String username) {
        return find("username", username).firstResultOptional();
    }

    public Optional<User> findByUsernameOrEmail(String identifier) {
        return find("username = ?1 OR email = ?1", identifier).firstResultOptional();
    }
}