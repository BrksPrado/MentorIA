import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam, Question, QuestionResponse } from '../models/quiz.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = 'http://localhost:8080/quizzes';

  constructor(private http: HttpClient) { }

  getAvailableExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/exams`);
  }

  // Atualizado para retornar Question[] diretamente
  getFullExamPage(year: number, limit: number, offset: number): Observable<Question[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<Question[]>(`${this.apiUrl}/full-exam-by-year`, { params });
  }

  getQuestionsByAreaPage(year: number, area: string, limit: number, page: number): Observable<QuestionResponse> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('area', area)
      .set('limit', limit.toString())
      .set('page', page.toString());

    return this.http.get<QuestionResponse>(`${this.apiUrl}/questions-by-area`, { params });
  }
}
