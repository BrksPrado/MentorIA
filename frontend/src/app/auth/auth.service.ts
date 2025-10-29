import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  userId: string;
  username: string;
  email: string;
  token: string;
  tokenType: string;
  expiresIn: number;
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
  private tokenExpirationKey = 'tokenExpiration';

  private authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenExpiration();
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          this.setToken(response.token, response.expiresIn);
          this.authStatusSubject.next(true);
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

  private setToken(token: string, expiresIn: number): void {

    localStorage.setItem(this.tokenKey, token);

    const expirationDate = new Date().getTime() + (expiresIn * 1000);
    localStorage.setItem(this.tokenExpirationKey, expirationDate.toString());
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
    this.authStatusSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private isTokenExpired(): boolean {
    const expirationDate = localStorage.getItem(this.tokenExpirationKey);

    if (!expirationDate) {
      return true;
    }

    const now = new Date().getTime();
    return now >= parseInt(expirationDate);
  }

  private checkTokenExpiration(): void {
    setInterval(() => {
      if (this.isTokenExpired()) {
        this.logout();
      }
    }, 60000); // 60 segundos
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  getUserData(): UserData | null {
    const tokenData = this.decodeToken();
    if (!tokenData) return null;

    return {
      userId: tokenData.sub || tokenData.userId,
      username: tokenData.username || tokenData.name,
      email: tokenData.email
    };
  }

  getUserProfile(): Observable<UserProfile> {
    const token = this.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, { headers });
  }
}
