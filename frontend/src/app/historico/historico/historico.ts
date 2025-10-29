import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimuladoDTO, SimuladoService } from '../services/simulado.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.html',
  standalone: false,
  styleUrls: ['./historico.css']
})
export class Historico implements OnInit {
  historico: any[] = []; // Tipo any para aceitar dataHora do backend
  isLoading: boolean = false;
  errorMessage: string | null = null;
  userId: string | null = null;

  constructor(
    private simuladoService: SimuladoService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log('Historico.ngOnInit() - Iniciando...');

    // Obtém dados do usuário
    const userData = this.authService.getUserData();
    console.log('UserData obtido:', userData);

    if (!userData || !userData.userId) {
      console.error("Usuário não identificado após decodificação do token");
      this.errorMessage = "Erro ao identificar o usuário. Faça login novamente.";
      this.snackBar.open(this.errorMessage, 'Fechar', { duration: 5000 });
      this.router.navigate(['/auth/login']);
      return;
    }

    this.userId = userData.userId;
    console.log('UserID definido:', this.userId);
    this.loadHistorico();
  }

  loadHistorico(): void {
    if (!this.userId) {
      console.error('userId é nulo, não é possível carregar histórico');
      return;
    }

    console.log('Carregando histórico para userId:', this.userId);
    this.isLoading = true;
    this.errorMessage = null;

    this.simuladoService.getHistoricoUsuario(this.userId).subscribe({
      next: (data) => {
        console.log('Histórico carregado com sucesso:', data);

        // Ordena do mais recente para o mais antigo
        this.historico = data.sort((a, b) => {
          // O backend retorna dataHora (não dataRealizacao)
          const dateA = new Date(a.dataHora || 0).getTime();
          const dateB = new Date(b.dataHora || 0).getTime();
          return dateB - dateA; // Mais recentes primeiro
        });

        console.log('Histórico ordenado:', this.historico);
        this.isLoading = false;

        if (this.historico.length === 0) {
          this.errorMessage = "Você ainda não completou nenhum simulado.";
        }
      },
      error: (err) => {
        console.error("Erro ao carregar histórico:", err);
        this.errorMessage = `Falha ao carregar histórico: ${err.message || 'Erro desconhecido'}`;
        this.isLoading = false;
        this.snackBar.open(this.errorMessage, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return dateString;
    }
  }
}
