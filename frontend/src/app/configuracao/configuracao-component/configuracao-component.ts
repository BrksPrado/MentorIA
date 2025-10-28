import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User } from './user.service'; // <-- importe o serviço correto

@Component({
  selector: 'app-configuracao',
  standalone: false,
  templateUrl: './configuracao-component.html',
  styleUrls: ['./configuracao-component.css'] // corrigido de styleUrl
})
export class Configuracao implements OnInit {
  isLoading = false;
  error: string | null = null;
  userImagePath = 'assets/img/usuario.webp';
  isEditing = false;
  showPasswordDialog = false;
  passwordForm: FormGroup;

  // Inicialização correta
  userData: User = {} as User;
  editedUserData: User = {} as User;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
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
    this.userService.getLoggedUser().subscribe({
      next: (user) => {
        this.isLoading = false;
        this.userData = user;
        this.editedUserData = { ...user }; // faz uma cópia para edição
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Erro ao carregar dados do usuário.';
        this.showErrorMessage(this.error);
      }
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedUserData = { ...this.userData };
    } else {
      this.editedUserData = { ...this.userData }; // restaurar dados originais
    }
  }

  saveProfile() {
    if (this.editedUserData && this.userData) {
      this.userService.updateUser(this.userData.userId, this.editedUserData).subscribe({
        next: (user) => {
          this.userData = user;
          this.editedUserData = { ...user }; // atualiza a cópia
          this.showSuccessMessage('Perfil atualizado com sucesso!');
          this.isEditing = false;
        },
        error: () => {
          this.showErrorMessage('Erro ao atualizar perfil.');
        }
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedUserData = { ...this.userData }; // volta para os dados originais
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
      console.log('Alterando senha:', this.passwordForm.value);
      this.showSuccessMessage('Senha alterada com sucesso!');
      this.closePasswordDialog();
    }
  }

  showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  showInfoMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['info-snackbar']
    });
  }
}
