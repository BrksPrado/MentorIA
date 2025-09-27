import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro implements OnInit {

  cadastroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      username: ['', Validators.required],

      email: ['', Validators.required, Validators.email],


      password: ['', Validators.required, Validators.minLength(6)]
    });
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      console.log('Formulário enviado!', this.cadastroForm.value);

      // 4. Chame o método register do serviço
      this.authService.register(this.cadastroForm.value).subscribe({
        next: (response) => {
          console.log('Registro bem-sucedido!', response);
          // Opcional: Redirecionar para a página de login após o sucesso
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Erro no registro', err);
          // Opcional: Mostrar uma mensagem de erro para o usuário
          alert(`Erro: ${err.error}`);
        }
      });

    } else {
      console.log('Formulário inválido');
    }
  }
}
