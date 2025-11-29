import { Component, OnInit } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { EventoList } from '../models/evento.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-eventos-list',
  standalone: false,
  templateUrl: './eventos-list.component.html',
  styleUrls: ['./eventos-list.component.css']
})
export class EventosListComponent implements OnInit {
  eventos: EventoList[] = [];
  userId: string = '';
  isLoading: boolean = false;

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if (userData) {
      this.userId = userData.userId;
      this.loadEventos();
    } else {
      this.snackBar.open('Usuário não autenticado', 'Fechar', { duration: 3000 });
      this.router.navigate(['/auth/login']);
    }
  }

  loadEventos(): void {
    this.isLoading = true;
    this.eventoService.getEventosByUsuario(this.userId).subscribe({
      next: (data) => {
        this.eventos = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar eventos', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onNovoEvento(): void {
    this.router.navigate(['/eventos/novo']);
  }

  onEditar(evento: EventoList): void {
    this.router.navigate(['/eventos/editar', evento.id]);
  }

  onDeletar(evento: EventoList): void {
    if (confirm('Tem certeza que deseja deletar este evento?')) {
      this.eventoService.deleteEvento(evento.id, this.userId).subscribe({
        next: () => {
          this.snackBar.open('Evento deletado com sucesso', 'Fechar', { duration: 3000 });
          this.loadEventos();
        },
        error: (error) => {
          this.snackBar.open('Erro ao deletar evento', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  getTipoLabel(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'VESTIBULAR': 'Vestibular',
      'PROVA': 'Prova',
      'EVENTO': 'Evento Geral',
      'OUTRO': 'Outro'
    };
    return tipos[tipo] || tipo;
  }
}