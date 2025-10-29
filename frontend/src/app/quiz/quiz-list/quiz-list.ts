import { Component, OnInit } from '@angular/core';
import { Exam } from '../models/quiz.models';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { SelectedYearService } from '../services/selectedYear.service';
import {AuthService} from '../../auth/auth.service';

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
    private authService: AuthService,
    private quizService: QuizService,
    private selectYearService: SelectedYearService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

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
    // Scroll suave para o carrossel
    setTimeout(() => {
      const carouselSection = document.querySelector('.carousel-section');
      if (carouselSection) {
        carouselSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  clearSelection(): void {
    this.selectedYear = null;
    this.selectedArea = null;
  }

  selectArea(area: string): void {
    this.selectedArea = area;
  }

  startFullQuiz(): void {
    if (this.selectedYear) {
      this.selectYearService.setYear(this.selectedYear);
      this.router.navigate(['/enem', this.selectedYear]);
    }
  }

  startAreaQuiz(area: string): void {
    if (this.selectedYear) {
      this.selectYearService.setYear(this.selectedYear);
      this.selectYearService.setArea(area);
      this.router.navigate(['/enem', this.selectedYear, area]);
    }
  }
}
