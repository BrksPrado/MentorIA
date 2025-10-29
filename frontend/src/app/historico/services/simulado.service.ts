import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {AuthService} from '../../auth/auth.service';

// Interface para o DTO de Simulado (pode criar um arquivo models/simulado.models.ts)
export interface SimuladoDTO {
  id?: string; // UUID é string no TS/JS
  userId: string;
  materiaId?: string | null; // Pode ser nulo
  pontuacao: number; // Porcentagem
  dataRealizacao?: string; // ISO string date
  observacoes?: string;
}

// Interface para o Simulado retornado (com ID gerado, etc.)
export interface Simulado extends SimuladoDTO {
  id: string; // ID é obrigatório aqui
  dataHora: string; // Backend retorna dataHora
  // Pode incluir dados do usuário ou matéria se o backend popular
  usuario?: { id: string, username: string };
  materia?: { id: string, nome: string };
}


@Injectable({
  providedIn: 'root'
})
export class SimuladoService {
  private apiUrl = 'http://localhost:8080/simulados'; // URL do backend

  constructor(
    private http: HttpClient,
    private authService: AuthService // Injete o AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Salva um novo simulado
  saveSimulado(simuladoData: SimuladoDTO): Observable<Simulado> {
    return this.http.post<Simulado>(this.apiUrl, simuladoData, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Busca o histórico de simulados de um usuário
  getHistoricoUsuario(userId: string): Observable<Simulado[]> {
    const url = `${this.apiUrl}/historico/${userId}`;
    return this.http.get<Simulado[]>(url, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Adicione outros métodos se necessário (getById, update, delete)

  private handleError(error: any): Observable<never> {
    console.error('Erro na API SimuladoService:', error);
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      // Erro client-side
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro backend-side
      errorMessage = `Erro ${error.status}: ${error.message || error.error}`;
      if (error.status === 401 || error.status === 403) {
        errorMessage = "Não autorizado. Faça login novamente.";
        // Opcional: Deslogar o usuário
        // this.authService.logout();
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
