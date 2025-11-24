import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

interface AuthResponse {
  userId: string;
  username: string;
  email: string;
  token?: string;
  tokenType?: string;
  expiresIn?: number;
}

interface UserData {
  userId: string;
  username: string;
  email: string;
}

interface UserProfile {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  profileImage?: string;
  createdAt?: string;
  lastLogin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'authToken';
  private userIdKey = 'loggedUserId';

  private authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response && response.userId) {
          // Salvar userId (obrigatório, mesmo sem token JWT)
          this.setUserId(response.userId);
          this.authStatusSubject.next(true);
          console.log('✅ Login bem-sucedido. UserId salvo:', response.userId);
        }
      }),
      catchError((error) => {
        this.logout();
        throw error;
      })
    );
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  private setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    this.authStatusSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    const userId = localStorage.getItem(this.userIdKey);
    console.log('🔍 Verificando login - UserId:', userId);
    return !!userId; // Apenas verifica se tem userId
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserData(): UserData | null {
    const userId = localStorage.getItem(this.userIdKey);

    if (!userId) {
      console.warn('⚠️ UserId não encontrado no localStorage');
      return null;
    }

    // Se temos token, decodifica; senão retorna apenas userId
    const token = this.getToken();
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return {
          userId: userId,
          username: decoded.username || '',
          email: decoded.email || ''
        };
      } catch (e) {
        console.warn('⚠️ Erro ao decodificar token');
      }
    }

    return { userId, username: '', email: '' };
  }

  getUserProfile(): Observable<UserProfile> {
    const userId = localStorage.getItem(this.userIdKey);
    if (!userId) {
      return of({} as UserProfile);
    }
    return this.http.get<UserProfile>(`http://localhost:8080/users/${userId}`);
  }
}
