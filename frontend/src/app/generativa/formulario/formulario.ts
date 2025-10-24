import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/generativa.service';
import { ExamGenerativa } from '../models/generativa.models';

@Component({
  selector: 'app-formulario',
  standalone: false,
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario {
  isLoading: boolean = true;

  listaDeQuestoes: ExamGenerativa[] = [];

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  buscarQuestoes(): void {
    this.isLoading = true;

    this.quizService.getQuestoesComContador(2).subscribe({
      next: (response) => {
        console.log('Resposta completa:', response.questions); // Verifique se não está null
        for (let questao of response.questions) {
          console.log('Questão:', questao.context);
        }

      },
      error: (err) => {
        console.error('Erro ao carregar questões:', err);
      }
    });


  }

}
