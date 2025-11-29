import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventoService } from '../services/evento.service';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { EventoList } from '../eventos/models/evento.model';
import { SharedModule } from '../../shared/shared-module';

@Component({
  selector: 'app-eventos-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MatSnackBarModule, RouterModule],
  templateUrl: './eventos-list.html',
  styleUrls: ['./eventos-list.css']
})
export class EventosListComponent implements OnInit {
  eventos: EventoList[] = [];
  isLoading = false;
  userId: string = '';

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

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
      next: (eventos) => {
        this.eventos = eventos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.snackBar.open('Erro ao carregar eventos', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/eventos/novo']);
  }

  editEvento(id: string): void {
    this.router.navigate(['/eventos/editar', id]);
  }

  deleteEvento(id: string): void {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      this.eventoService.deleteEvento(id, this.userId).subscribe({
        next: () => {
          this.snackBar.open('Evento excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadEventos();
        },
        error: (error) => {
          console.error('Erro ao excluir evento:', error);
          this.snackBar.open('Erro ao excluir evento', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
