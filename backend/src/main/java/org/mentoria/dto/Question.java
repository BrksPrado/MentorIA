package org.mentoria.dto;

import java.util.List;

public class Question {
    
    private int index;
    private String discipline;
    private String context;
    private String image;
    private String correctAlternative;
    private String alternativesIntroduction;
    
    // O Jackson mapeará o array JSON de alternativas para esta List
    private List<Alternative> alternatives; 

    // Construtor padrão (necessário para Jackson)
    public Question() {}
    
    // Construtor com todos os campos (opcional)
    // ...

    // Getters e Setters (Necessário para que o Jackson leia e escreva as propriedades)

    public int getIndex() { return index; }
    public void setIndex(int index) { this.index = index; }

    public String getDiscipline() { return discipline; }
    public void setDiscipline(String discipline) { this.discipline = discipline; }
    
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getCorrectAlternative() { return correctAlternative; }
    public void setCorrectAlternative(String correctAlternative) { this.correctAlternative = correctAlternative; }

    public String getAlternativesIntroduction() { return alternativesIntroduction; }
    public void setAlternativesIntroduction(String alternativesIntroduction) { this.alternativesIntroduction = alternativesIntroduction; }

    public List<Alternative> getAlternatives() { return alternatives; }
    public void setAlternatives(List<Alternative> alternatives) { this.alternatives = alternatives; }
}