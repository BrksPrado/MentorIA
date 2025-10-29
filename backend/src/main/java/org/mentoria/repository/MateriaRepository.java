package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.domain.Materia;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class MateriaRepository implements PanacheRepository<Materia> {

    // Retorna Optional<Materia>
    public Optional<Materia> findByIdOptional(UUID id) {
        return Materia.findByIdOptional(id);
    }

    public Optional<Materia> findByNome(String nome) {
        return find("nome", nome).firstResultOptional();
    }
}