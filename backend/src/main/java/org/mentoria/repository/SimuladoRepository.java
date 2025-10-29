package org.mentoria.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.mentoria.domain.Simulado;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class SimuladoRepository implements PanacheRepository<Simulado> {

    public Optional<Simulado> findByIdOptional(UUID id) {
        return Simulado.findByIdOptional(id);
    }

    public List<Simulado> findByMateriaId(UUID materiaId) {
        return find("materia.id", materiaId).list();
    }

    public List<Simulado> findByUsuarioId(UUID usuarioId) {
        return find("usuario.id", usuarioId).list();
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

    public Double getAveragePontuacaoByUsuario(UUID usuarioId) {
        Object result = find("SELECT AVG(s.pontuacao) FROM Simulado s WHERE s.usuario.id = ?1", usuarioId)
                .firstResult();
        return result != null ? ((Number) result).doubleValue() : 0.0;
    }

    public Double getAveragePontuacaoByUsuarioAndMateria(UUID usuarioId, UUID materiaId) {
        Object result = find("SELECT AVG(s.pontuacao) FROM Simulado s WHERE s.usuario.id = ?1 AND s.materia.id = ?2", usuarioId, materiaId)
                .firstResult();
        return result != null ? ((Number) result).doubleValue() : 0.0;
    }
}