import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/generativa.service';
import { ExamGenerativa } from '../models/generativa.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  standalone: false,
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario {
  isLoading: boolean = true;

  listaDeQuestoes: ExamGenerativa[] = [];

  constructor(
    private quizService: QuizService,
    private router: Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  buscarQuestoes(): void {
    this.isLoading = true;

    this.quizService.getQuestoesComContador(2).subscribe({
      next: (response) => {
        console.log(response.questions);
        this.quizService.setQuestoesParaExecutar(response.questions);
        this.router.navigate(['/generativa/generativa-runner'])

      },
      error: (err) => {
        console.error('Erro ao carregar questões:', err);
        this.isLoading = false;
      }
    });


  }

}
