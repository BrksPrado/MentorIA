import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

export interface User {
  userId?: string;
  id?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  password?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  // Armazenar userId do usuário logado
  setLoggedUserId(userId: string): void {
    localStorage.setItem('loggedUserId', userId);
    console.log('✅ UserId armazenado:', userId);
  }

  getLoggedUserId(): string | null {
    const userId = localStorage.getItem('loggedUserId');
    console.log('🔍 UserId recuperado:', userId);
    return userId;
  }

  // Buscar usuário pelo ID
  getUserById(userId: string): Observable<User> {
    if (!userId) {
      return throwError(() => new Error('UserId não fornecido'));
    }
    console.log('📥 Buscando usuário:', userId);
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  // Atualizar usuário
  updateUser(userId: string, data: Partial<User>): Observable<User> {
    if (!userId) {
      return throwError(() => new Error('UserId não fornecido'));
    }
    console.log('📤 Atualizando usuário:', userId, data);
    return this.http.put<User>(`${this.apiUrl}/${userId}`, data);
  }

  // Alterar senha do usuário
  changePassword(userId: string, passwordData: ChangePasswordRequest): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('UserId não fornecido'));
    }

    console.log('🔐 Alterando senha para usuário:', userId);
    console.log('📤 Dados completos:', passwordData);

    const payload = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };

    console.log('📤 Payload enviado:', payload);

    return this.http.put(`${this.apiUrl}/${userId}/password`, payload).pipe(
      tap(response => {
        console.log('✅ Resposta do servidor:', response);
      }),
      catchError(error => {
        console.error('❌ Erro completo:', error);
        console.log('📊 Status:', error.status);
        console.log('📊 Error body:', error.error);

        let errorMessage = 'Erro ao alterar senha';

        if (error.status === 404) {
          errorMessage = 'Usuário não encontrado';
        } else if (error.status === 400) {
          errorMessage = error.error || 'Senha atual incorreta';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }



  // Buscar usuário logado
  getLoggedUser(): Observable<User> {
    const userId = this.getLoggedUserId();
    if (!userId) {
      console.error('❌ Usuário logado não encontrado');
      return throwError(() => new Error('Usuário logado não encontrado. Por favor, faça login novamente.'));
    }
    return this.getUserById(userId);
  }
}
