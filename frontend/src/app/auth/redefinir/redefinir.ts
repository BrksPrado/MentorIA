import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-redefinir',
  standalone: false,
  templateUrl: './redefinir.html',
  styleUrl: './redefinir.css'
})
export class Redefinir implements OnInit {
  redefinirForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.redefinirForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.redefinirForm.valid) {
      console.log('Formulário de redefinição enviado!', this.redefinirForm.value);

      this.isLoading = true;

      // Simular chamada para API
      setTimeout(() => {
        this.isLoading = false;
        
        this.snackBar.open('Email de redefinição enviado com sucesso!', 'X', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });

        // Redirecionar para login após sucesso
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      }, 2000);
    } else {
      this.snackBar.open('Por favor, preencha um email válido.', 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
  }

  voltarParaLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
