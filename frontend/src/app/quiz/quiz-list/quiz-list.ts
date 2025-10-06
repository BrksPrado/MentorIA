import { Component, OnInit } from '@angular/core';
import { Exam } from '../models/quiz.models';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-quiz-list',
  standalone: false,
  templateUrl: './quiz-list.html',
  styleUrls: ['./quiz-list.css']
})
export class QuizList implements OnInit {

  exams: Exam[] = [];
  isLoading: boolean = true;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicia o loading como true
    this.isLoading = true;

    // Subscribe ao Observable para controlar o loading
    this.quizService.getAvailableExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar simulados:', err);
        this.isLoading = false;
      }
    });
  }

  startQuiz(year: number): void {
    this.router.navigate(['/quiz', year]);
  }
}
