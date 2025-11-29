import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Question } from '../models/generativa.models';
import { QuizService } from '../services/generativa.service';
import {SimuladoDTO, SimuladoService} from '../../historico/services/simulado.service';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-quiz-runner',
  templateUrl: './runner.html',
  styleUrls: ['./runner.css'],
  standalone: false
})
export class Runner implements OnInit {
  quizQuestions: Question[] = [];
  currentQuestionIndex: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  quizFinished: boolean = false; // Flag para indicar fim do quiz
  userId: string | null = null; // Para guardar o ID do usuário
  isSaving: boolean = false; // Para feedback visual ao salvar

  // Armazena as respostas do usuário
  userAnswers: { [key: number]: string } = {};

  // Expõe Object para o template
  Object = Object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private quizservice: QuizService,
    private authService: AuthService, // Injete AuthService
    private simuladoService: SimuladoService, // Injete SimuladoService
    private snackBar: MatSnackBar // Injete MatSnackBar
  ) { }

  ngOnInit(): void {
    this.quizQuestions = this.quizservice.getQuestoesParaExecutar();

    if (this.quizQuestions.length === 0) {
      this.errorMessage = "Nenhuma questão carregada...";
      this.router.navigate(["/generativa"]);
    } else {
      this.isLoading = false;
    }
  }

  // Salva a resposta do usuário
  selectAnswer(questionIndex: number, letter: string): void {
    this.userAnswers[questionIndex] = letter;
  }

  // Verifica se uma alternativa foi selecionada
  isSelected(questionIndex: number, letter: string): boolean {
    return this.userAnswers[questionIndex] === letter;
  }

  // Verifica se a questão já foi respondida
  isAnswered(questionIndex: number): boolean {
    return this.userAnswers[questionIndex] !== undefined;
  }

  // Verifica se a alternativa é a correta
  isCorrectAlternative(questionIndex: number, letter: string): boolean {
    const question = this.quizQuestions.find(q => q.index === questionIndex);
    return question ? question.correctAlternative === letter : false;
  }

  // Verifica se o usuário acertou a questão
  isCorrectAnswer(questionIndex: number): boolean {
    const question = this.quizQuestions.find(q => q.index === questionIndex);
    if (!question) return false;
    return this.userAnswers[questionIndex] === question.correctAlternative;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  // Retorna ao início
  goBackToList(): void {
    this.router.navigate(['/generativa']);
  }

  // Calcula quantas questões foram respondidas
  getAnsweredCount(): number {
    return Object.keys(this.userAnswers).length;
  }

  // Calcula quantas questões foram acertadas
  getCorrectCount(): number {
    let count = 0;
    this.quizQuestions.forEach(question => {
      if (this.userAnswers[question.index] === question.correctAlternative) {
        count++;
      }
    });
    return count;
  }

  // Retorna a classe CSS para uma alternativa
  getAlternativeClass(questionIndex: number, letter: string): string {
    const isAnswered = this.isAnswered(questionIndex);
    const isSelected = this.isSelected(questionIndex, letter);
    const isCorrect = this.isCorrectAlternative(questionIndex, letter);

    if (!isAnswered) {
      return isSelected ? 'selected' : '';
    }

    // Questão já foi respondida - mostrar feedback
    if (isCorrect) {
      return 'correct'; // Verde
    } else if (isSelected && !isCorrect) {
      return 'incorrect'; // Vermelho
    }

    return '';
  }

  saveResult(): void {
    console.log("📤 saveResult() iniciado");

    if (!this.userId) {
      console.error("❌ ID do usuário não encontrado!");
      this.snackBar.open('Erro ao identificar usuário para salvar o resultado.', 'Fechar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (this.isSaving) {
      console.warn("⚠️ Já está salvando, ignorando nova chamada");
      return;
    }

    this.isSaving = true;

    const correctCount = this.getCorrectCount();
    const totalQuestions = this.quizQuestions.length;
    const score = (correctCount / totalQuestions) * 100;
    const observacao = `Acertou ${correctCount} de ${totalQuestions} questões.`;

    const simuladoData: SimuladoDTO = {
      userId: this.userId,
      pontuacao: parseFloat(score.toFixed(1)),
      dataRealizacao: new Date().toISOString(),
      observacoes: observacao
    };

    console.log("📊 Dados do simulado:", simuladoData);
    console.log(`Resultado: ${correctCount}/${totalQuestions} corretas = ${score.toFixed(1)}%`);

    this.simuladoService.saveSimulado(simuladoData).subscribe({
      next: (savedSimulado) => {
        console.log("✅ Simulado salvo com sucesso:", savedSimulado);
        this.snackBar.open(
          `Resultado salvo! Pontuação: ${simuladoData.pontuacao.toFixed(1)}%`,
          'OK',
          { duration: 4000, panelClass: ['success-snackbar'] }
        );
        this.isSaving = false;

        // Aguarda um pouco antes de navegar para o histórico
        setTimeout(() => {
          this.router.navigate(['/historico']);
        }, 2000);
      },
      error: (err) => {
        console.error("❌ Erro ao salvar simulado:", err);
        this.snackBar.open(
          `Erro ao salvar resultado: ${err.message || 'Verifique sua conexão.'}`,
          'Fechar',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
        this.isSaving = false;
      }
    });
  }
}
