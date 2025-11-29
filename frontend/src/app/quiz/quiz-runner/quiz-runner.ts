import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, QuestionResponse } from '../models/quiz.models';
import { HttpErrorResponse } from '@angular/common/http';
import { QuizService } from '../services/quiz.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {AuthService} from '../../auth/auth.service';
import {SimuladoDTO, SimuladoService} from '../../historico/services/simulado.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-quiz-runner',
  templateUrl: './quiz-runner.html',
  styleUrls: ['./quiz-runner.css'],
  standalone: false
})
export class QuizRunner implements OnInit {

  quizQuestions: Question[] = [];
  currentQuestionIndex: number = 0;
  year: number = 0;
  area: string | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  quizFinished: boolean = false; // Flag para indicar fim do quiz
  userId: string | null = null; // Para guardar o ID do usuário
  isSaving: boolean = false; // Para feedback visual ao salvar

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private sanitizer: DomSanitizer,
    private authService: AuthService, // Injete AuthService
    private simuladoService: SimuladoService, // Injete SimuladoService
    private snackBar: MatSnackBar // Injete MatSnackBar
  ) { }

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if (!userData || !userData.userId) {
      console.error("Usuário não logado!");
      this.snackBar.open('Você precisa estar logado para realizar simulados.', 'Fechar', { duration: 5000 });
      this.router.navigate(['/auth/login']); // Redireciona para login
      return; // Interrompe a inicialização
    }
    this.userId = userData.userId;

    // ... (resto do código de carregamento das questões) ...
    const yearParam = this.route.snapshot.paramMap.get('year');
    const areaParam = this.route.snapshot.paramMap.get('area');

    if (yearParam) {
      this.year = +yearParam;
      this.isLoading = true; // Garante que isLoading está true
      this.errorMessage = null; // Limpa erros anteriores
      this.quizFinished = false; // Reseta o estado de finalizado

      if (areaParam) {
        this.area = areaParam;
        this.loadQuestionsByArea(this.year, this.area);
      } else {
        this.area = null; // Garante que area é null para prova completa
        this.loadFullExam(this.year);
      }
    } else {
      this.errorMessage = "Ano do exame não especificado na URL.";
      this.isLoading = false;
    }
  }

  // Funções separadas para carregar questões
  loadQuestionsByArea(year: number, area: string): void {
    this.quizService.getQuestionsByArea(year, area).subscribe({
      next: (response: QuestionResponse) => this.handleQuestionsResponse(response.questions),
      error: (err: HttpErrorResponse) => this.handleErrorResponse(err, 'área')
    });
  }

  loadFullExam(year: number): void {
    this.quizService.getFullExam(year).subscribe({
      next: (response: Question[]) => this.handleQuestionsResponse(response),
      error: (err: HttpErrorResponse) => this.handleErrorResponse(err, 'simulado completo')
    });
  }

  handleQuestionsResponse(questions: Question[]): void {
    if (questions && Array.isArray(questions) && questions.length > 0) {
      this.quizQuestions = questions;
    } else {
      this.quizQuestions = []; // Garante que a lista está vazia
      this.errorMessage = `Nenhuma questão encontrada para ${this.area ? `a área ${this.area} de ` : ''}${this.year}.`;
    }
    this.isLoading = false;
  }

  handleErrorResponse(err: HttpErrorResponse, type: string): void {
    console.error(`ERRO: Falha ao buscar ${type}!`, err);
    this.errorMessage = `Erro ${err.status}: Não foi possível carregar as questões. Tente novamente.`;
    this.isLoading = false;
    this.quizQuestions = []; // Limpa questões em caso de erro
  }


  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
    this.checkIfFinished(); // Verifica se chegou ao fim após avançar
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
    // Não precisa verificar se terminou aqui
  }


  getAnsweredCount(): number {
    return Object.keys(this.userAnswers).length;
  }

  userAnswers: { [key: number]: string } = {};



  getCorrectCount(): number {
    let count = 0;
    this.quizQuestions.forEach(question => {
      if (this.userAnswers[question.index] === question.correctAlternative) {
        count++;
      }
    });
    return count;
  }

  // Helper para obter um nome mais amigável da área
  getAreaLabel(areaValue: string): string {
    switch (areaValue) {
      case 'linguagens': return 'Linguagens';
      case 'matematica': return 'Matemática';
      case 'ciencias-natureza': return 'Ciências da Natureza';
      case 'ciencias-humanas': return 'Ciências Humanas';
      default: return areaValue;
    }
  }
  isAnswered(questionIndex: number): boolean {
    return this.userAnswers[questionIndex] !== undefined;
  }

  isCorrectAnswer(questionIndex: number): boolean {
    const question = this.quizQuestions.find(q => q.index === questionIndex);
    if (!question) return false;
    return this.userAnswers[questionIndex] === question.correctAlternative;
  }

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

  selectAnswer(questionIndex: number, letter: string): void {
    this.userAnswers[questionIndex] = letter;
    console.log(`Resposta registrada: Q${questionIndex} = ${letter}`);

    const answered = this.getAnsweredCount();
    const total = this.quizQuestions.length;
    console.log(`Progresso: ${answered}/${total} questões respondidas`);

    // Chama a verificação para saber se terminou
    this.checkIfFinished();
  }

  checkIfFinished(): void {
    const answered = this.getAnsweredCount();
    const total = this.quizQuestions.length;

    console.log(`checkIfFinished(): answered=${answered}, total=${total}, quizFinished=${this.quizFinished}`);

    if (!this.quizFinished && answered === total) {
      console.log("✅ QUIZ FINALIZADO! Salvando resultado...");
      this.quizFinished = true;
      this.saveResult();
    }
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
    const observacao = `ENEM ${this.year} - ${this.area ? this.getAreaLabel(this.area) : 'Completo'}`;

    const simuladoData: SimuladoDTO = {
      userId: this.userId,
      pontuacao: parseFloat(score.toFixed(1)),
      dataRealizacao: new Date().toISOString(),
      observacoes: observacao,
      acertos: correctCount,
      totalQuestoes: totalQuestions
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


  isCorrectAlternative(questionIndex: number, letter: string): boolean {
    const question = this.quizQuestions.find(q => q.index === questionIndex);
    return question ? question.correctAlternative === letter : false;
  }

  isSelected(questionIndex: number, letter: string): boolean {
    return this.userAnswers[questionIndex] === letter;
  }

  parseMarkdownToHtml(markdown: string): SafeHtml {
    if (!markdown) return '';

    // Converte imagens markdown ![alt](url) para <img src="url" alt="alt">
    let html = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; margin: 1rem 0; display: block;">');

    // Converte links markdown [text](url) para <a href="url">text</a>
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Converte quebras de linha duplas em parágrafos
    html = html.replace(/\n\n/g, '</p><p>');

    // Converte quebras de linha simples
    html = html.replace(/\n/g, '<br>');

    // Envolve em parágrafo se não começar com tag
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // Modificar goBackToList para limpar estado se necessário
  goBackToList(): void {
    // Opcional: Limpar userAnswers, currentQuestionIndex etc., se desejar resetar ao voltar
    this.router.navigate(['/enem']); // Navega para a lista de quizzes do ENEM
  }


}
