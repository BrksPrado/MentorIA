package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.domain.Evento;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class EventoRepository implements PanacheRepository<Evento> {

    public Optional<Evento> findByIdOptional(UUID id) {
        return Evento.findByIdOptional(id);
    }

    public List<Evento> findByUsuarioId(UUID usuarioId) {
        return find("usuario.id", usuarioId).list();
    }

    public List<Evento> findByUsuarioIdAndMes(UUID usuarioId, int ano, int mes) {
        return find("usuario.id = ?1 AND YEAR(dataEvento) = ?2 AND MONTH(dataEvento) = ?3",
                usuarioId, ano, mes).list();
    }

    public List<Evento> findByUsuarioIdAndPeriodo(UUID usuarioId, LocalDateTime inicio, LocalDateTime fim) {
        return find("usuario.id = ?1 AND dataEvento BETWEEN ?2 AND ?3",
                usuarioId, inicio, fim).list();
    }

    public List<Evento> findUpcomingEventos(UUID usuarioId) {
        return find("usuario.id = ?1 AND dataEvento >= ?2 ORDER BY dataEvento ASC",
                usuarioId, LocalDateTime.now()).list();
    }
}