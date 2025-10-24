package org.mentoria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import com.fasterxml.jackson.databind.ObjectMapper; 
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;

import org.mentoria.dto.QuestionsContainer; 
import org.mentoria.dto.request.OllamaGenerateRequestDTO;
import org.mentoria.dto.request.OllamaGenerateResponseDTO;

/**
 * Serviço responsável pela comunicação com a API Ollama e desserialização de JSON.
 */
@ApplicationScoped
public class OllamaService {

    @Inject
    ObjectMapper objectMapper; 

    private final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private final Client client = ClientBuilder.newClient(); 

    /**
     * Gera questões chamando a API Ollama e desserializa a resposta JSON.
     * @param numQuestoes O número de questões desejado.
     * @return Um container de questões desserializado, ou null em caso de erro.
     */
    public String gerarQuestoes(Integer numQuestoes) {
        
        String prompt = """
                Gere questões inéditas inspiradas no estilo do vestibular da UEL (Paraná). 
                As questões devem abranger diferentes disciplinas (como Português, Matemática, História, Biologia, Química, etc.), 
                variando em tema, estrutura e tipo de raciocínio exigido (interpretação, cálculo, análise, inferência, etc.).

                ⚠️ Importante:
                - TER EXATAMENTE %d QUESTÕES
                - Cada questão deve ter 5 alternativas.
                - Retorne SOMENTE o JSON, SEM ASPAS TRIPLAS, sem explicações nem texto fora dele.
                - O JSON deve seguir EXATAMENTE o formato abaixo.
                - O campo "context" pode conter um pequeno texto, gráfico descrito ou situação-problema.
                - O campo "alternativesIntroduction" é o enunciado da pergunta (o texto que vem antes das alternativas).
                - O campo "correctAlternative" deve corresponder à letra correta.
                - Cada questão deve ter apenas uma alternativa correta.
                - O campo "image" pode ficar vazio ("") caso a questão não use imagem, caso utilize é necessario retornar o bytecode da imagem nele.
                - O campo "file" dentro de "alternatives" deve ser sempre null.
                - Todas as questoes devem estar dentro da chave "questions"

                Modelo de retorno:

                {
                "questions": [
                    {
                    "index": 1,
                    "discipline": "Disciplina da vez",
                    "context": "Texto que será usado como base para a pergunta.",
                    "image": "",
                    "correctAlternative": "A",
                    "alternativesIntroduction": "Com base no texto, assinale a alternativa correta:",
                    "alternatives": [
                        {
                        "letter": "A",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": true
                        },
                        {
                        "letter": "B",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": false
                        },
                        {
                        "letter": "C",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": false
                        },
                        {
                        "letter": "D",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": false
                        },
                        {
                        "letter": "E",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": false
                        }
                    ]
                    },
                     {
                    "index": 2,
                    "discipline": "Disciplina da vez 2",
                    "context": "Texto que será usado como base para a pergunta.",
                    "image": "",
                    "correctAlternative": "A",
                    "alternativesIntroduction": "Com base no texto, assinale a alternativa correta:",
                    "alternatives": [
                        {
                        "letter": "A",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": true
                        },
                        {
                        "letter": "B",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": false
                        },
                        {
                        "letter": "C",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": false
                        },
                        {
                        "letter": "D",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": false
                        },
                        {
                        "letter": "E",
                        "text": "Texto da alternativa.",
                        "file": null,
                        "isCorrect": false
                        }
                    ]
                    }
                ]
                }
                """.formatted(numQuestoes);

        OllamaGenerateRequestDTO request = new OllamaGenerateRequestDTO(
            "llama3.2:3b", // Modelo 
            prompt,
            false 
        );

        String jsonString = null;

        try {
            System.out.println("DEBUG: Enviando requisição para Ollama...");
            
            // 1. Chamar o Ollama e receber o DTO de resposta (que contém a String JSON)
            OllamaGenerateResponseDTO ollamaResponse = client.target(OLLAMA_URL)
                .request(MediaType.APPLICATION_JSON)
                .post(Entity.json(request), OllamaGenerateResponseDTO.class);

            // 2. Extrair a String JSON bruta da resposta do Ollama
            jsonString = ollamaResponse.response();

            // LOG DA STRING BRUTA PARA DEBUG
            System.out.println("DEBUG: JSON Bruto recebido do Ollama:\n" + jsonString);

            // 3. Desserializar o JSON bruto para o nosso DTO QuestionsContainer.
            // QuestionsContainer questions = objectMapper.readValue(jsonString, QuestionsContainer.class);

            // System.out.println("DEBUG: Desserialização bem-sucedida.");
            return jsonString; 

        } catch (Exception e) {
            // Se cair aqui, a string não era JSON válido.
            System.err.println("ERRO FATAL: Falha ao desserializar o JSON. Detalhes:");
            System.err.println("  1. Mensagem de Erro: " + e.getMessage());
            System.err.println("  2. JSON Bruto (re-impressão): " + (jsonString != null ? jsonString.substring(0, Math.min(jsonString.length(), 300)) + "..." : "NULO"));
            System.err.println("  3. Causa (verifique se há texto extra fora das chaves {}):");
            e.printStackTrace();
            return null; // Retorna null em caso de falha.
        }
    }
}
