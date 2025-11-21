import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Interface que representa o usuário no frontend
export interface User {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Endpoint base do backend Quarkus
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  // -----------------------------
  // Armazenar UUID do usuário logado
  // -----------------------------
  setLoggedUserId(userId: string): void {
    localStorage.setItem('loggedUserId', userId);
  }

  getLoggedUserId(): string | null {
    return localStorage.getItem('loggedUserId');
  }

  // -----------------------------
  // Buscar usuário pelo ID
  // -----------------------------
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  // -----------------------------
  // Atualizar usuário
  // -----------------------------
  updateUser(userId: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, data);
  }

  // -----------------------------
  // Buscar usuário logado diretamente
  // -----------------------------
  getLoggedUser(): Observable<User> {
    const userId = this.getLoggedUserId();
    if (!userId) {
      return throwError(() => new Error('Usuário logado não encontrado. Por favor, faça login novamente.'));
    }
    return this.getUserById(userId);
  }
}
