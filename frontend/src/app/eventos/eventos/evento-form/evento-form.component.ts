import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Evento } from '../models/evento.model';

@Component({
  selector: 'app-evento-form',
  standalone: false,
  templateUrl: './evento-form.component.html',
  styleUrls: ['./evento-form.component.css']
})
export class EventoFormComponent implements OnInit {
  eventoForm: FormGroup;
  isEditMode = false;
  eventoId: string | null = null;
  userId: string = '';
  isLoading = false;
  isSubmitting = false;
  tiposEvento: { value: string, label: string }[] = [];
  cores: { value: string, label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descricao: [''],
      dataEvento: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      cor: ['#667eea']
    });
  }

  ngOnInit(): void {
    this.loadTiposECores();
    const userData = this.authService.getUserData();
    if (userData) {
      this.userId = userData.userId;
    } else {
      this.snackBar.open('Usuário não autenticado', 'Fechar', { duration: 3000 });
      this.router.navigate(['/auth/login']);
      return;
    }

    this.eventoId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.eventoId;

    if (this.isEditMode && this.eventoId) {
      this.loadEvento(this.eventoId);
    }
  }

  loadTiposECores(): void {
    // Carregar tipos
    this.eventoService.getTiposEvento().subscribe({
      next: (tipos) => {
        this.tiposEvento = tipos.map(tipo => ({
          value: tipo,
          label: this.getTipoLabel(tipo)
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar tipos:', error);
        // Fallback para valores padrão
        this.tiposEvento = [
          { value: 'VESTIBULAR', label: 'Vestibular' },
          { value: 'PROVA', label: 'Prova' },
          { value: 'EVENTO', label: 'Evento Geral' },
          { value: 'OUTRO', label: 'Outro' }
        ];
      }
    });

    // Carregar cores
    this.eventoService.getCoresEvento().subscribe({
      next: (cores) => {
        this.cores = cores;
      },
      error: (error) => {
        console.error('Erro ao carregar cores:', error);
        // Fallback para valores padrão
        this.cores = [
          { value: '#667eea', label: 'Azul' },
          { value: '#764ba2', label: 'Roxo' },
          { value: '#f093fb', label: 'Rosa' },
          { value: '#4facfe', label: 'Azul Claro' },
          { value: '#43e97b', label: 'Verde' },
          { value: '#38f9d7', label: 'Turquesa' },
          { value: '#fa709a', label: 'Vermelho' },
          { value: '#fee140', label: 'Amarelo' }
        ];
      }
    });
  }

  loadEvento(id: string): void {
    this.isLoading = true;
    this.eventoService.getEventoById(id).subscribe({
      next: (evento) => {
        this.eventoForm.patchValue({
          titulo: evento.titulo,
          descricao: evento.descricao,
          dataEvento: new Date(evento.dataEvento).toISOString().slice(0, 16), // Formato para datetime-local
          tipo: evento.tipo,
          cor: evento.cor
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar evento', 'Fechar', { duration: 3000 });
        this.router.navigate(['/eventos']);
      }
    });
  }

  onSubmit(): void {
    if (this.eventoForm.valid) {
      this.isSubmitting = true;
      const formValue = this.eventoForm.value;
      const evento: Evento = {
        ...formValue,
        dataEvento: new Date(formValue.dataEvento).toISOString(),
        userId: this.userId
      };

      const request$ = this.isEditMode && this.eventoId
        ? this.eventoService.updateEvento(this.eventoId, evento)
        : this.eventoService.createEvento(evento);

      request$.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Evento atualizado com sucesso' : 'Evento criado com sucesso';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.router.navigate(['/eventos']);
        },
        error: (error) => {
          console.error('Erro na operação:', error);
          const message = this.isEditMode ? 'Erro ao atualizar evento' : 'Erro ao criar evento';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.eventoForm.controls).forEach(key => {
        this.eventoForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/eventos']);
  }

  private getTipoLabel(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'VESTIBULAR': 'Vestibular',
      'PROVA': 'Prova',
      'EVENTO': 'Evento Geral',
      'OUTRO': 'Outro'
    };
    return tipos[tipo] || tipo;
  }
}