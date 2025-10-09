import { Component, OnInit } from '@angular/core';
import { Exam } from '../models/quiz.models';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import {SelectedYearService} from '../services/selectedYear.service';

@Component({
  selector: 'app-quiz-list',
  standalone: false,
  templateUrl: './quiz-list.html',
  styleUrls: ['./quiz-list.css']
})
export class QuizList implements OnInit {

  exams: Exam[] = [];
  isLoading: boolean = true;
  selectedYear: number | null = null;
  selectedArea: string | null = null;

  constructor(
    private quizService: QuizService,
    private selectYearService: SelectedYearService,
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

  selectYear(year: number): void {
    this.selectedYear = year;
  }

  selectArea(area: string): void {
    this.selectedArea = area;
  }

  startFullQuiz(): void {
    if (this.selectedYear) {
      this.selectYearService.setYear(this.selectedYear);
      this.router.navigate(['/enem', this.selectedYear]);
    } else {
      // Implementar um alerta aqui
    }
  }

  startAreaQuiz(area: string): void {
    if (this.selectedYear) {
      this.selectYearService.setYear(this.selectedYear);
      this.selectYearService.setArea(area);
      this.router.navigate(['/enem', this.selectedYear, area]);
    } else {
      // Implementar um alerta aqui
    }
  }
}
