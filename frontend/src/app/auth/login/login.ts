import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,

    private snackBar: MatSnackBar
  ) {}

  loginForm!: FormGroup;


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulário enviado!', this.loginForm.value);

    
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido!', response);
          // Opcional: Salvar o token (ex: no localStorage) e redirecionar
    
          this.snackBar.open('Login bem-sucedido!', 'X',
            {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          this.router.navigate(['/home']); // Redireciona para a homepage
        },
        error: (err) => {
          console.error('Erro no login', err);
          
          this.snackBar.open('Erro no login. Verifique suas credenciais.', 'X',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
        }
      });
    } else {
      console.log('Formulário inválido');

      this.snackBar.open('Erro no login. Verifique suas credenciais.', 'X',
        {
          duration: 10000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
    }
  }

}
