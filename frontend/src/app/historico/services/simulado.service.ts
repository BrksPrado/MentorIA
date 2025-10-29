import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {AuthService} from '../../auth/auth.service';

// Interface para o DTO de Simulado
export interface SimuladoDTO {
  id?: string;
  userId: string;
  materiaId?: string | null;
  pontuacao: number;
  dataRealizacao?: string;
  observacoes?: string;
  acertos?: number;
  totalQuestoes?: number;
}

// Interface para o Simulado retornado
export interface Simulado extends SimuladoDTO {
  id: string;
  dataHora: string;
  usuario?: { id: string, username: string };
  materia?: { id: string, nome: string };
}

@Injectable({
  providedIn: 'root'
})
export class SimuladoService {
  private apiUrl = 'http://localhost:8080/simulados';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  saveSimulado(simuladoData: SimuladoDTO): Observable<Simulado> {
    return this.http.post<Simulado>(this.apiUrl, simuladoData, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getHistoricoUsuario(userId: string): Observable<Simulado[]> {
    const url = `${this.apiUrl}/historico/${userId}`;
    return this.http.get<Simulado[]>(url, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  putDescricaoSimulado(simuladoId: string, descricao: string): Observable<Simulado> {
    const url = `${this.apiUrl}/${simuladoId}/descricao`;
    return this.http.put<Simulado>(url, { observacoes: descricao }, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erro na API SimuladoService:', error);
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message || error.error}`;
      if (error.status === 401 || error.status === 403) {
        errorMessage = "Não autorizado. Faça login novamente.";
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
