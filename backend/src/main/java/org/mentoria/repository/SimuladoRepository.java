package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.domain.Simulado;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class SimuladoRepository implements PanacheRepository<Simulado> {

    public Simulado findById(UUID id) {
        return (Simulado) Simulado.findByIdOptional(id)
                .orElseThrow(() -> new RuntimeException("Simulado não encontrado"));
    }

    public List<Simulado> findByMateriaId(UUID materiaId) {
        return find("materia.id", materiaId).list();
    }

    public Double getAveragePontuacao() {
        Object result = find("SELECT AVG(s.pontuacao) FROM Simulado s")
                .firstResult();
        return result != null ? ((Number) result).doubleValue() : 0.0;
    }

    public Double getAveragePontuacaoByMateria(UUID materiaId) {
        Object result = find("SELECT AVG(s.pontuacao) FROM Simulado s WHERE s.materia.id = ?1", materiaId)
                .firstResult();
        return result != null ? ((Number) result).doubleValue() : 0.0;
    }
}