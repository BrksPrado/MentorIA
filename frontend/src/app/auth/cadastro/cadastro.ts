import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro implements OnInit {

  cadastroForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)

      ]]
    });
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      console.log('Formulário enviado!', this.cadastroForm.value);

      this.isLoading = true;

      this.authService.register(this.cadastroForm.value).subscribe({
        next: (response) => {
          console.log('Registro bem-sucedido!', response);

          this.snackBar.open('Cadastro bem-sucedido!', 'X',
            {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom'
            });

          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['/auth/login']);
          }, 500);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erro no registro', err);

          let errorMessage = 'Ocorreu um erro no registro.';
          if (err.status === 400 && err.error) {
            errorMessage = err.error;
          }

          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });

    } else {
      console.log('Formulário inválido');

      this.snackBar.open('Requisitos não atendidos: verifique se sua senha possui 6 dígitos', 'Desculpa',
        {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
    }
  }
}
