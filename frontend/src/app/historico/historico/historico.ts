
import { Component, OnInit } from '@angular/core';
import { Simulado, SimuladoService } from '../services/simulado.service';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.html',
  standalone: false,
  styleUrls: ['./historico.css']
})
export class Historico implements OnInit {

  historico: Simulado[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  userId: string | null = null;

  isEditMode = false;
  editingId: string | null = null;
  editText: string = '';

  constructor(
    private simuladoService: SimuladoService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if (userData && userData.userId) {
      this.userId = userData.userId;
      this.loadHistorico();
    } else {
      this.errorMessage = "Usuário não encontrado. Faça login para ver o histórico.";
      this.isLoading = false;
    }
  }

  loadHistorico(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.simuladoService.getHistoricoUsuario(this.userId).subscribe({
      next: (data) => {
        this.historico = data.sort((a, b) =>
          new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Falha ao carregar histórico: ${err.message}`;
        this.isLoading = false;
      }
    });
  }


  toggleEditMode(mode: boolean): void {
    this.isEditMode = mode;
    if (mode === false) {
      this.cancelEdit();
    }
  }

  startEdit(item: Simulado): void {
    if (!this.isEditMode) {
      return;
    }
    this.editingId = item.id;
    this.editText = item.observacoes || '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editText = '';
  }

  saveEdit(simuladoId: string): void {
    if (!this.editingId) return;

    const newDescricao = this.editText;

    this.simuladoService.putDescricaoSimulado(simuladoId, newDescricao).subscribe({
      next: (updatedSimulado) => {
        const index = this.historico.findIndex(h => h.id === simuladoId);
        if (index > -1) {
          this.historico[index] = updatedSimulado;
        }
        this.snackBar.open('Descrição atualizada com sucesso!', 'OK', { duration: 3000 });
        this.cancelEdit();
      },
      error: (err) => {
        this.snackBar.open(`Erro ao salvar: ${err.message}`, 'Fechar', { duration: 5000 });
      }
    });
  }

  deleteItem(simuladoId: string): void {
    this.simuladoService.deleteSimulado(simuladoId).subscribe({
      next: () => {
        this.historico = this.historico.filter(h => h.id !== simuladoId);
        this.snackBar.open('Simulado deletado com sucesso!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(`Erro ao deletar: ${err.message}`, 'Fechar', { duration: 5000 });
      }
    });
  }
  formatDate(dateString: string): string {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
