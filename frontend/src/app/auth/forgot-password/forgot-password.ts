import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      console.log('Solicitando reset de senha...', this.forgotPasswordForm.value);
      
      this.isLoading = true;

      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (response) => {
          console.log('Solicitação enviada com sucesso!', response);
          
          this.snackBar.open('Instruções de recuperação enviadas para seu email!', 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });

          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('Erro ao solicitar reset de senha', err);

          let errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';

          if (err.status === 400 && err.error) {
            errorMessage = err.error;
          } else if (err.status === 404) {
            errorMessage = 'Usuário não encontrado. Verifique os dados informados.';
          } else if (err.status === 0) {
            errorMessage = 'Erro de conexão com o servidor.';
          }

          this.snackBar.open(errorMessage, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
  }

  goBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
