import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, QuestionResponse } from '../models/quiz.models';
import { HttpErrorResponse } from '@angular/common/http';
import { QuizService } from '../services/quiz.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  // Armazena as respostas do usuário
  userAnswers: { [key: number]: string } = {};

  // Expõe Object para o template
  Object = Object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const yearParam = this.route.snapshot.paramMap.get('year');
    const areaParam = this.route.snapshot.paramMap.get('area');

    if (yearParam) {
      this.year = +yearParam;

      // Se tem área, busca apenas dessa área
      if (areaParam) {
        this.area = areaParam;

        this.quizService.getQuestionsByArea(this.year, this.area).subscribe({
          next: (response: QuestionResponse) => {
            console.log('SUCESSO: Questões por área!', response);
            if (response && response.questions && Array.isArray(response.questions)) {
              this.quizQuestions = response.questions;
            }
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error('ERRO: Falha ao buscar questões por área!', err);
            this.errorMessage = `Erro ${err.status}: Não foi possível carregar as questões.`;
            this.isLoading = false;
          }
        });
      } else {
        // Se não tem área, busca prova completa
        this.quizService.getFullExam(this.year).subscribe({
          next: (response: Question[]) => {
            console.log('SUCESSO: Prova completa!', response);
            if (response && Array.isArray(response)) {
              this.quizQuestions = response;
            }
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error('ERRO: Falha ao buscar o simulado!', err);
            this.errorMessage = `Erro ${err.status}: Não foi possível carregar o simulado.`;
            this.isLoading = false;
          }
        });
      }
    }
  }

  // Converte markdown para HTML (especialmente imagens)
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
    this.router.navigate(['/enem']);
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
}
