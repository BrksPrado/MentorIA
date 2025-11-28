package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.mentoria.domain.Evento;
import org.mentoria.domain.Usuario;
import org.mentoria.dto.EventoListResponseDTO;
import org.mentoria.dto.EventoResponseDTO;
import org.mentoria.dto.request.EventoDTO;
import org.mentoria.repository.EventoRepository;
import org.mentoria.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class EventoService {

    @Inject
    EventoRepository eventoRepository;

    @Inject
    UserRepository userRepository;

    public List<EventoResponseDTO> findAll() {
        return Evento.findAll().list().stream()
                .map(e -> toResponseDTO((Evento) e))
                .collect(Collectors.toList());
    }

    public EventoResponseDTO findById(UUID id) {
        return eventoRepository.findByIdOptional(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com ID: " + id));
    }

    public List<EventoListResponseDTO> findByUsuarioId(UUID usuarioId) {
        userRepository.findByIdOptional(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + usuarioId));

        return eventoRepository.findByUsuarioId(usuarioId).stream()
                .map(this::toListResponseDTO)
                .collect(Collectors.toList());
    }

    public List<EventoListResponseDTO> findByUsuarioIdAndMes(UUID usuarioId, int ano, int mes) {
        userRepository.findByIdOptional(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return eventoRepository.findByUsuarioIdAndMes(usuarioId, ano, mes).stream()
                .map(this::toListResponseDTO)
                .collect(Collectors.toList());
    }

    public List<EventoListResponseDTO> findProximosEventos(UUID usuarioId) {
        userRepository.findByIdOptional(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return eventoRepository.findUpcomingEventos(usuarioId).stream()
                .limit(10)
                .map(this::toListResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventoResponseDTO createEvento(EventoDTO eventoDTO) {
        if (eventoDTO.dataEvento() == null) {
            throw new IllegalArgumentException("Data do evento é obrigatória");
        }

        Usuario usuario = userRepository.findByIdOptional(eventoDTO.userId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + eventoDTO.userId()));

        Evento evento = new Evento();
        evento.usuario = usuario;
        evento.titulo = eventoDTO.titulo();
        evento.descricao = eventoDTO.descricao();
        evento.dataEvento = eventoDTO.dataEvento();
        evento.tipo = eventoDTO.tipo();
        evento.cor = eventoDTO.cor() != null ? eventoDTO.cor() : "#667eea";
        evento.persist();

        return toResponseDTO(evento);
    }

    @Transactional
    public EventoResponseDTO updateEvento(EventoDTO eventoDTO) {
        Evento evento = eventoRepository.findByIdOptional(eventoDTO.id())
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com ID: " + eventoDTO.id()));

        if (!evento.usuario.id.equals(eventoDTO.userId())) {
            throw new IllegalArgumentException("Não é permitido alterar evento de outro usuário");
        }

        evento.titulo = eventoDTO.titulo();
        evento.descricao = eventoDTO.descricao();
        evento.dataEvento = eventoDTO.dataEvento();
        evento.tipo = eventoDTO.tipo();
        evento.cor = eventoDTO.cor() != null ? eventoDTO.cor() : evento.cor;
        evento.persist();

        return toResponseDTO(evento);
    }

    @Transactional
    public void deleteEvento(UUID id, UUID usuarioId) {
        Evento evento = eventoRepository.findByIdOptional(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com ID: " + id));

        if (!evento.usuario.id.equals(usuarioId)) {
            throw new IllegalArgumentException("Não é permitido deletar evento de outro usuário");
        }

        eventoRepository.delete(evento);
    }

    private EventoResponseDTO toResponseDTO(Evento evento) {
        return new EventoResponseDTO(
                evento.id,
                evento.titulo,
                evento.descricao,
                evento.dataEvento,
                evento.tipo,
                evento.cor,
                evento.dataCriacao,
                evento.dataAtualizacao,
                evento.usuario.id
        );
    }

    private EventoListResponseDTO toListResponseDTO(Evento evento) {
        return new EventoListResponseDTO(
                evento.id,
                evento.titulo,
                evento.dataEvento,
                evento.tipo,
                evento.cor
        );
    }
}