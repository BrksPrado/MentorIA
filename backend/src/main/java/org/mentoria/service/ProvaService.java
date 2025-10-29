package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.mentoria.domain.Materia;
import org.mentoria.domain.Prova;
import org.mentoria.dto.request.ProvaDTO;
import org.mentoria.repository.MateriaRepository;
import org.mentoria.repository.ProvaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ProvaService {

    @Inject
    ProvaRepository provaRepository;

    @Inject
    MateriaRepository materiaRepository;

    public List<Prova> findAll() {
        return Prova.listAll();
    }

    public Prova findById(UUID id) {
        return provaRepository.findByIdOptional(id)
                .orElseThrow(() -> new RuntimeException("Prova não encontrada com ID: " + id));
    }

    public List<Prova> findByMateriaId(UUID materiaId) {
        // Valida se a matéria existe
        materiaRepository.findByIdOptional(materiaId)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com ID: " + materiaId));
        return provaRepository.findByMateriaId(materiaId);
    }

    public List<Prova> findByDataBetween(LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (dataInicio.isAfter(dataFim)) {
            throw new IllegalArgumentException("Data início não pode ser após data fim");
        }
        return provaRepository.findByDataBetween(dataInicio, dataFim);
    }

    public List<Prova> findUpcomingProvas() {
        return provaRepository.findUpcomingProvas(LocalDateTime.now());
    }

    @Transactional
    public Prova createProva(ProvaDTO provaDTO) {
        if (provaDTO.data() == null) {
            throw new IllegalArgumentException("Data é obrigatória");
        }

        Materia materia = materiaRepository.findByIdOptional(provaDTO.materiaId())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com ID: " + provaDTO.materiaId()));

        Prova prova = new Prova();
        prova.dataHora = provaDTO.data();
        prova.descricao = provaDTO.descricao();
        prova.materia = materia;
        prova.persist();

        return prova;
    }

    @Transactional
    public Prova updateProva(ProvaDTO provaDTO) {
        Prova prova = findById(provaDTO.id());

        prova.dataHora = provaDTO.data();
        prova.descricao = provaDTO.descricao();

        if (!prova.materia.id.equals(provaDTO.materiaId())) {
            Materia novaMateria = materiaRepository.findByIdOptional(provaDTO.materiaId())
                    .orElseThrow(() -> new RuntimeException("Matéria não encontrada com ID: " + provaDTO.materiaId()));
            prova.materia = novaMateria;
        }

        prova.persist();
        return prova;
    }

    @Transactional
    public void deleteProva(UUID id) {
        Prova prova = findById(id);
        provaRepository.delete(prova);
    }
}