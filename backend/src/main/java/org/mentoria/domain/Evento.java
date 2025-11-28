package org.mentoria.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_evento")
public class Evento extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    public Usuario usuario;

    @Column(nullable = false)
    public String titulo;

    @Column(nullable = true, columnDefinition = "TEXT")
    public String descricao;

    @Column(nullable = false)
    public LocalDateTime dataEvento;

    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    public String tipo;

    @Column(nullable = true)
    public String cor;

    @Column(nullable = false, updatable = false)
    public LocalDateTime dataCriacao;

    @Column(nullable = false)
    public LocalDateTime dataAtualizacao;

    @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
        this.dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }
}