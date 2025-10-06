import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  returnUrl: string = '/home';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulário enviado!', this.loginForm.value);

      this.isLoading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido!', response);

          this.snackBar.open('Login bem-sucedido!', 'X', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });

          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate([this.returnUrl]);
          }, 500);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erro no login', err);

          let errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';

          if (err.status === 400 && err.error) {
            errorMessage = err.error;
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
}
