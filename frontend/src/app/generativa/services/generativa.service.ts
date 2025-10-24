import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamGenerativa } from '../models/generativa.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = 'http://localhost:8080/ollama';

  constructor(private http: HttpClient) { }

  getQuestoesComContador(count: number): Observable<ExamGenerativa> {
    const params = new HttpParams().set('numberOfQuestions', count.toString());

    // Angular já converte JSON automaticamente
    return this.http.get<ExamGenerativa>(`${this.apiUrl}/get_questions`, { params });


  }

}
