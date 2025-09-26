import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, public router: Router) {}

  navigateToCadastrar() {
    this.router.navigate(['/cadastrar']);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(6)]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulario enviado!', this.loginForm.value);
      // TODO: Logica
    } else {
      console.log('Formulario invalido');
    }
  }

}
