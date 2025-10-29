package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.domain.Prova;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ProvaRepository implements PanacheRepository<Prova> {

    public Optional<Prova> findByIdOptional(UUID id) {
        return Prova.findByIdOptional(id);
    }

    public List<Prova> findByMateriaId(UUID materiaId) {
        return find("materia.id", materiaId).list();
    }

    public List<Prova> findByDataBetween(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return find("dataHora BETWEEN ?1 AND ?2", dataInicio, dataFim).list();
    }

    public List<Prova> findUpcomingProvas(LocalDateTime dataAtual) {
        return find("dataHora >= ?1 ORDER BY dataHora ASC", dataAtual).list();
    }
}