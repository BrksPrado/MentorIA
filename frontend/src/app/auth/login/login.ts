import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
    public router: Router
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

      // 3. Chame o método login do serviço
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido!', response);
          // Opcional: Salvar o token (ex: no localStorage) e redirecionar
          this.router.navigate(['/']); // Redireciona para a homepage
        },
        error: (err) => {
          console.error('Erro no login', err);
          alert(`Erro: ${err.error}`);
        }
      });
    } else {
      console.log('Formulário inválido');
    }
  }

}
