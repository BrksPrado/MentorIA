/**
 * 1. Interface para representar uma alternativa de resposta.
 */
export interface Alternative {
    letter: string;         // Ex: "A", "B", "C"
    text: string;           // O texto da alternativa
    file: string | null;    // URL de um arquivo (imagem/áudio) ou null
    isCorrect: boolean;     // Indica se esta é a alternativa correta (true/false)
}

/**
 * 2. Interface para representar uma questão completa.
 */
export interface Question {
    index: number;                          // Índice da questão (Ex: 1, 2, 3...)
    discipline: string;                     // Disciplina (Ex: "História", "Matemática")
    context: string;                        // O texto principal da questão
    image?: string;                         // URL opcional de uma imagem para o contexto
    correctAlternative: string;             // Letra da alternativa correta (Ex: "A", "C")
    alternativesIntroduction: string;       // Frase que introduz as alternativas
    alternatives: Alternative[];            // Array de objetos Alternative
}

/**
 * 3. Interface principal que representa o payload completo da resposta (o "Exame").
 * O objeto raiz do seu JSON é deste tipo.
 */
export interface ExamGenerativa {
    questions: Question[];                  // Array de objetos Question
}