import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento, EventoList } from '../eventos/models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost:8080/eventos';

  constructor(private http: HttpClient) { }

  getAllEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  getEventoById(id: string): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  getEventosByUsuario(userId: string): Observable<EventoList[]> {
    return this.http.get<EventoList[]>(`${this.apiUrl}/usuario/${userId}`);
  }

  getEventosByMes(userId: string, ano: number, mes: number): Observable<EventoList[]> {
    const params = new HttpParams()
      .set('ano', ano.toString())
      .set('mes', mes.toString());
    return this.http.get<EventoList[]>(`${this.apiUrl}/usuario/${userId}/mes`, { params });
  }

  getProximosEventos(userId: string): Observable<EventoList[]> {
    return this.http.get<EventoList[]>(`${this.apiUrl}/usuario/${userId}/proximos`);
  }

  createEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  updateEvento(id: string, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento);
  }

  deleteEvento(id: string, userId: string): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params });
  }

  getTiposEvento(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tipos`);
  }

  getCoresEvento(): Observable<{value: string, label: string}[]> {
    return this.http.get<{value: string, label: string}[]>(`${this.apiUrl}/cores`);
  }
}