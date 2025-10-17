package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.mentoria.domain.Materia;

import java.util.Optional;
import java.util.UUID;

public class MateriaRepository implements PanacheRepository<Materia> {

    public Materia findById(UUID id) {
        return (Materia) Materia.findByIdOptional(id)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));
    }

    public Optional<Materia> findByNome(String nome) {
        return find("nome", nome).firstResultOptional();
    }


}
