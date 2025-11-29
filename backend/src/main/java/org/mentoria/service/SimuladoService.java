package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.mentoria.domain.Materia;
import org.mentoria.domain.Simulado;
import org.mentoria.domain.Usuario;
import org.mentoria.dto.request.SimuladoDTO;
import org.mentoria.repository.MateriaRepository;
import org.mentoria.repository.SimuladoRepository;
import org.mentoria.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class SimuladoService {

    @Inject
    SimuladoRepository simuladoRepository;

    @Inject
    MateriaRepository materiaRepository;

    @Inject
    UserRepository userRepository;

    public List<Simulado> findAll() {
        return Simulado.listAll();
    }

    public Simulado findById(UUID id) {
        return (Simulado) Simulado.findByIdOptional(id)
                .orElseThrow(() -> new RuntimeException("Simulado não encontrado com ID: " + id));
    }

    public List<Simulado> findByMateriaId(UUID materiaId) {
        // Valida se a matéria existe
        materiaRepository.findByIdOptional(materiaId)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com ID: " + materiaId));
        return simuladoRepository.findByMateriaId(materiaId);
    }

    public Double getAveragePontuacao() {
        return simuladoRepository.getAveragePontuacao();
    }

    public Double getAveragePontuacaoByMateria(UUID materiaId) {
        // Valida se a matéria existe
        materiaRepository.findByIdOptional(materiaId)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com ID: " + materiaId));
        return simuladoRepository.getAveragePontuacaoByMateria(materiaId);
    }

    public List<Simulado> findByUsuarioId(UUID usuarioId) {
        userRepository.findByIdOptional(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + usuarioId));
        return simuladoRepository.findByUsuarioId(usuarioId);
    }

    public List<Simulado> findByUsuarioAndMateriaId(UUID usuarioId, UUID materiaId) {
        userRepository.findByIdOptional(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + usuarioId));
        materiaRepository.findByIdOptional(materiaId)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada com ID: " + materiaId));
        return simuladoRepository.findByUsuarioId(usuarioId).stream()
                .filter(s -> s.materia != null && s.materia.id.equals(materiaId))
                .toList();
    }

    @Transactional
    public Simulado createSimulado(SimuladoDTO simuladoDTO) {
        if (simuladoDTO.pontuacao() == null || simuladoDTO.pontuacao() < 0 || simuladoDTO.pontuacao() > 100) {
            throw new IllegalArgumentException("Pontuação inválida ou ausente. Deve estar entre 0 e 100.");
        }
        if (simuladoDTO.userId() == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório.");
        }

        // Busca o usuário
        Usuario usuario = userRepository.findByIdOptional(simuladoDTO.userId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + simuladoDTO.userId()));

        Materia materia = null;
        if (simuladoDTO.materiaId() != null) {
            materia = materiaRepository.findByIdOptional(simuladoDTO.materiaId()).orElse(null);
        }

        Simulado simulado = new Simulado();
        simulado.usuario = usuario;
        simulado.materia = materia;
        simulado.pontuacao = simuladoDTO.pontuacao();
        simulado.dataHora = (simuladoDTO.dataRealizacao() != null) ? simuladoDTO.dataRealizacao() : LocalDateTime.now();
        simulado.observacoes = simuladoDTO.observacoes();
        simulado.acertos = simuladoDTO.acertos();
        simulado.totalQuestoes = simuladoDTO.totalQuestoes();

        simuladoRepository.persist(simulado);

        return simulado;
    }

    @Transactional
    public Simulado updateSimulado(UUID id, SimuladoDTO simuladoDTO) {
        Simulado simulado = findById(id);

        if (!simulado.usuario.id.equals(simuladoDTO.userId())) {
            throw new IllegalArgumentException("Não é permitido alterar o usuário de um simulado.");
        }

        if (simuladoDTO.pontuacao() != null) {
            if (simuladoDTO.pontuacao() < 0 || simuladoDTO.pontuacao() > 100) {
                throw new IllegalArgumentException("Pontuação deve estar entre 0 e 100");
            }
            simulado.pontuacao = simuladoDTO.pontuacao();
        }
        if (simuladoDTO.dataRealizacao() != null) {
            simulado.dataHora = simuladoDTO.dataRealizacao();
        }
        if (simuladoDTO.observacoes() != null) {
            simulado.observacoes = simuladoDTO.observacoes();
        }

        // Atualiza a matéria se um ID diferente (e não nulo) for fornecido
        if (simuladoDTO.materiaId() != null && (simulado.materia == null || !simulado.materia.id.equals(simuladoDTO.materiaId()))) {
            Materia novaMateria = materiaRepository.findByIdOptional(simuladoDTO.materiaId()).orElse(null);
            simulado.materia = novaMateria;
        } else if (simuladoDTO.materiaId() == null) {
            simulado.materia = null; // Permite remover a matéria
        }

        simuladoRepository.persist(simulado);
        return simulado;
    }

    @Transactional
    public void deleteSimulado(UUID id) {
        Simulado simulado = findById(id);
        simuladoRepository.delete(simulado);
    }

    public List<Simulado> findSimuladosByUserId(UUID userId) {
        userRepository.findByIdOptional(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));
        return simuladoRepository.findByUsuarioId(userId);
    }

    @Transactional
    public Simulado updateObservacoes(UUID id, String observacoes) {
        if (observacoes == null) {
            throw new IllegalArgumentException("Observações não podem ser nulas.");
        }

        Simulado simulado = Simulado.findById(id);
        if (simulado == null) {
            throw new NotFoundException("Simulado com ID " + id + " não encontrado.");
        }

        simulado.setObservacoes(observacoes);

        return simulado;
    }

    @Transactional
    public void deleteSimuladosByUserId(UUID userId) {
        List<Simulado> simulados = findSimuladosByUserId(userId);
        for (Simulado simulado : simulados) {
            simuladoRepository.delete(simulado);
        }
    }
}