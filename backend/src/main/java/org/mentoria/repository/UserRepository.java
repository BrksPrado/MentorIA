package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.exceptions.UserNotFoundException;
import org.mentoria.model.User;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public List<User> findAllUsers(Integer page, Integer pageSize) {
        return User.findAll().page(page, pageSize).list();
    }

    public User findByUserId(UUID userId) {
        return (User) User.findByIdOptional(userId)
                .orElseThrow(UserNotFoundException::new);
    }

}