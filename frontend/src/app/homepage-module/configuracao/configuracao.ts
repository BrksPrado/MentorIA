import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-configuracao',
  standalone: false,
  templateUrl: './configuracao.html',
  styleUrl: './configuracao.css'
})
export class Configuracao implements OnInit {
  isLoading = false;
  error: string | null = null;
  userData: any = null;
  userImagePath = 'assets/img/usuario.webp';
  isEditing = false;
  editedUserData: any = null;
  showPasswordDialog = false;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.error = null;
    // TODO: Implement actual user data loading logic
    setTimeout(() => {
      this.isLoading = false;
      this.userData = {
        username: 'usuario_teste',
        email: 'teste@exemplo.com',
        userId: '12345',
        firstName: 'João',
        lastName: 'Silva',
        phone: '(11) 99999-9999',
        createdAt: new Date()
      };
    }, 1000);
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      // Criar uma cópia dos dados para edição
      this.editedUserData = { ...this.userData };
    } else {
      // Cancelar edição e restaurar dados originais
      this.editedUserData = null;
    }
  }

  saveProfile() {
    if (this.editedUserData) {
      // Atualizar os dados originais com as alterações
      this.userData = { ...this.editedUserData };
      
      // TODO: Implementar chamada para API para salvar no backend
      console.log('Salvando perfil:', this.userData);
      
      // Sair do modo de edição
      this.isEditing = false;
      this.editedUserData = null;
      
      // Mostrar notificação de sucesso
      this.showSuccessMessage('Perfil atualizado com sucesso!');
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedUserData = null;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  openChangePasswordDialog() {
    this.showPasswordDialog = true;
    this.passwordForm.reset();
  }

  closePasswordDialog() {
    this.showPasswordDialog = false;
    this.passwordForm.reset();
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value;
      // TODO: Implementar chamada para API para alterar senha
      console.log('Alterando senha:', passwordData);
      
      // Simular sucesso e mostrar notificação
      this.showSuccessMessage('Senha alterada com sucesso!');
      this.closePasswordDialog();
    }
  }

  // Métodos para exibir notificações
  showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',    // Canto direito
      verticalPosition: 'bottom',  // Parte inferior
      panelClass: ['success-snackbar']
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'end',    // Canto direito
      verticalPosition: 'bottom',  // Parte inferior
      panelClass: ['error-snackbar']
    });
  }

  showInfoMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',    // Canto direito
      verticalPosition: 'bottom',  // Parte inferior
      panelClass: ['info-snackbar']
    });
  }
}
