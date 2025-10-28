package org.mentoria.dto;

// Imports do Jackson para mapeamento, se necessário
// import com.fasterxml.jackson.annotation.JsonProperty; 

public class Alternative {
    
    private String letter;
    private String text;
    private String file; // Como é null no JSON, String é adequado
    private boolean isCorrect;

    // Construtor padrão (necessário para Jackson)
    public Alternative() {}

    // Construtor com todos os campos (opcional)
    public Alternative(String letter, String text, String file, boolean isCorrect) {
        this.letter = letter;
        this.text = text;
        this.file = file;
        this.isCorrect = isCorrect;
    }

    // Getters e Setters (Necessário para que o Jackson leia e escreva as propriedades)
    public String getLetter() { return letter; }
    public void setLetter(String letter) { this.letter = letter; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getFile() { return file; }
    public void setFile(String file) { this.file = file; }

    public boolean isCorrect() { return isCorrect; }
    public void setCorrect(boolean isCorrect) { this.isCorrect = isCorrect; }
}