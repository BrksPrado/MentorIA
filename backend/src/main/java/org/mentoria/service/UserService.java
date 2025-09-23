package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.mentoria.exceptions.UserNotFoundException;
import org.mentoria.model.User;
import org.mentoria.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    @Transactional
    public User createUser(User user) {
        userRepository.persist(user);
        return user;
    }

    public List<User> findAllUsers(Integer page, Integer pageSize) {
        return userRepository.findAllUsers(page, pageSize);
    }

    public User findByUserId(UUID userId) {
        return userRepository.findByUserId(userId);
    }

    @Transactional
    public User updateUser(UUID userId, User user) {
        User findedUser = findByUserId(userId);

        findedUser.username = user.username;
        findedUser.email = user.email;

        userRepository.persist(findedUser);
        return findedUser;
    }

    @Transactional
    public void deleteUser(UUID userId) {
        userRepository.delete(findByUserId(userId));
    }
}
