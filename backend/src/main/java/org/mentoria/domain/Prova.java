package org.mentoria.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class Prova extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @Column(unique = false, nullable = false)
    public String descricao;

    @Column(unique = false, nullable = false)
    public LocalDateTime dataHora;

    @ManyToOne
    public Materia materia;


}