package org.mentoria.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_simulado")
public class Simulado extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    public Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "materia_id", nullable = true)
    public Materia materia;

    @Column(unique = false, nullable = true)
    public Double pontuacao;

    @Column(unique = false, nullable = true)
    public LocalDateTime dataHora;

    @Column(unique = false, nullable = true)
    public String observacoes;

    @Column(unique = false, nullable = true)
    public Integer acertos;  // ← NOVO

    @Column(unique = false, nullable = true)
    public Integer totalQuestoes;  // ← NOVO

    public Simulado() {}


    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}