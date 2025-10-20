package org.mentoria.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "simulado")
public class Simulado extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @Column(unique = false, nullable = true)
    public Double pontuacao;

    @Column(unique = false, nullable = true)
    public LocalDateTime dataHora;

    @Column(unique = false, nullable = true)
    public String observacoes;

    @ManyToOne
    public Materia materia;


}