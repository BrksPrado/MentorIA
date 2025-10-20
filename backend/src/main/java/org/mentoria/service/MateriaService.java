package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.mentoria.domain.Materia;
import org.mentoria.dto.request.MateriaDTO;
import org.mentoria.repository.MateriaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class MateriaService {

    @Inject
    MateriaRepository materiaRepository;

    public List<Materia> findAll() {
        return Materia.listAll();
    }

    public Materia findById(UUID id) {
        return materiaRepository.findById(id);
    }

    public Optional<Materia> findByNome(String nome) {
        return materiaRepository.findByNome(nome);
    }

    @Transactional
    public Materia createMateria(MateriaDTO materiaDTO) {
        materiaRepository.findByNome(materiaDTO.nome())
                .ifPresent(m -> {
                    throw new IllegalArgumentException("Matéria com este nome já existe");
                });

        Materia materia = new Materia();
        materia.nome = materiaDTO.nome();
        materia.identificador = materiaDTO.identificador();
        materia.persist();

        return materia;
    }

    @Transactional
    public Materia updateMateria(MateriaDTO materiaDTO) {
        Materia findedMateria = findById(materiaDTO.id());

        if (!findedMateria.nome.equals(materiaDTO.nome())) {
            materiaRepository.findByNome(materiaDTO.nome())
                    .ifPresent(m -> {
                        if (!m.id.equals(materiaDTO.id())) {
                            throw new IllegalArgumentException("Matéria com este nome já está em uso");
                        }
                    });
        }

        findedMateria.nome = materiaDTO.nome();
        findedMateria.identificador = materiaDTO.identificador();
        findedMateria.persist();

        return findedMateria;
    }

    @Transactional
    public void deleteMateria(String nome) {
        Optional<Materia> findedMateria = findByNome(nome);
        if (findedMateria.isPresent()) {
            materiaRepository.delete(findedMateria.get());
        } else {
            throw new IllegalArgumentException("Matéria não encontrada");
        }
    }

    @Transactional
    public void deleteMateriaById(UUID id) {
        Materia materia = findById(id);
        materiaRepository.delete(materia);
    }
}