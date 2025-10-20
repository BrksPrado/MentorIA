package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.mentoria.domain.Materia;
import org.mentoria.domain.Simulado;
import org.mentoria.dto.request.SimuladoDTO;
import org.mentoria.repository.MateriaRepository;
import org.mentoria.repository.SimuladoRepository;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class SimuladoService {

    @Inject
    SimuladoRepository simuladoRepository;

    @Inject
    MateriaRepository materiaRepository;

    public List<Simulado> findAll() {
        return Simulado.listAll();
    }

    public Simulado findById(UUID id) {
        return simuladoRepository.findById(id);
    }

    public List<Simulado> findByMateriaId(UUID materiaId) {
        materiaRepository.findById(materiaId);
        return simuladoRepository.findByMateriaId(materiaId);
    }

    public Double getAveragePontuacao() {
        return simuladoRepository.getAveragePontuacao();
    }

    public Double getAveragePontuacaoByMateria(UUID materiaId) {
        materiaRepository.findById(materiaId);
        return simuladoRepository.getAveragePontuacaoByMateria(materiaId);
    }

    @Transactional
    public Simulado createSimulado(SimuladoDTO simuladoDTO) {
        if (simuladoDTO.pontuacao() < 0 || simuladoDTO.pontuacao() > 100) {
            throw new IllegalArgumentException("Pontuação deve estar entre 0 e 100");
        }

        Materia materia = materiaRepository.findById(simuladoDTO.materiaId());

        Simulado simulado = new Simulado();
        simulado.materia = materia;
        simulado.pontuacao = simuladoDTO.pontuacao();
        simulado.dataHora = simuladoDTO.dataRealizacao();
        simulado.observacoes = simuladoDTO.observacoes();
        simulado.persist();

        return simulado;
    }

    @Transactional
    public Simulado updateSimulado(SimuladoDTO simuladoDTO) {
        Simulado simulado = findById(simuladoDTO.id());

        if (simuladoDTO.pontuacao() < 0 || simuladoDTO.pontuacao() > 100) {
            throw new IllegalArgumentException("Pontuação deve estar entre 0 e 100");
        }

        simulado.pontuacao = simuladoDTO.pontuacao();
        simulado.dataHora = simuladoDTO.dataRealizacao();
        simulado.observacoes = simuladoDTO.observacoes();

        if (!simulado.materia.id.equals(simuladoDTO.materiaId())) {
            Materia novaMateria = materiaRepository.findById(simuladoDTO.materiaId());
            simulado.materia = novaMateria;
        }

        simulado.persist();
        return simulado;
    }

    @Transactional
    public void deleteSimulado(UUID id) {
        Simulado simulado = findById(id);
        simuladoRepository.delete(simulado);
    }
}