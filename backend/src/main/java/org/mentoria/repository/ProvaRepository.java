package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.domain.Prova;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ProvaRepository implements PanacheRepository<Prova> {

    public Prova findById(UUID id) {
        return (Prova) Prova.findByIdOptional(id)
                .orElseThrow(() -> new RuntimeException("Prova não encontrada"));
    }

    public List<Prova> findByMateriaId(UUID materiaId) {
        return find("materia.id", materiaId).list();
    }

    public List<Prova> findByDataBetween(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return find("data BETWEEN ?1 AND ?2", dataInicio, dataFim).list();
    }

    public List<Prova> findUpcomingProvas(LocalDateTime dataAtual) {
        return find("data >= ?1 ORDER BY data ASC", dataAtual).list();
    }
}