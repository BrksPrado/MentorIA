package org.mentoria.dto;

import java.util.List;

public class QuestionsContainer {
    
    // O nome do atributo deve ser EXATAMENTE igual à chave JSON: "questions"
    private List<Question> questions;

    // Construtor padrão (necessário para Jackson)
    public QuestionsContainer() {}

    // Getters e Setters

    public List<Question> getQuestions() { return questions; }

    public void setQuestions(List<Question> questions) { this.questions = questions; }
}