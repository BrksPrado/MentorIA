import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User, ChangePasswordRequest } from './user.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-configuracao',
  standalone: false,
  templateUrl: './configuracao-component.html',
  styleUrls: ['./configuracao-component.css']
})
export class Configuracao implements OnInit {
  isLoading = false;
  error: string | null = null;
  userImagePath = 'assets/img/usuario.webp';
  isEditing = false;
  showPasswordDialog = false;
  passwordForm: FormGroup;
  isChangingPassword = false;

  userData: User = {} as User;
  editedUserData: User = {} as User;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService
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
    this.error = null;

    const loggedUserId = this.userService.getLoggedUserId();
    console.log('=== CARREGANDO PERFIL ===');
    console.log('UserId:', loggedUserId);

    if (!loggedUserId) {
      this.error = 'Usuário não encontrado. Faça login novamente.';
      this.isLoading = false;
      this.showErrorMessage(this.error);
      return;
    }

    this.userService.getLoggedUser().subscribe({
      next: (user) => {
        console.log('✅ Usuário carregado:', user);
        this.userData = user;
        this.editedUserData = { ...user };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar usuário:', err);
        this.error = 'Erro ao carregar dados do usuário.';
        this.isLoading = false;
        this.showErrorMessage(this.error);
      }
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedUserData = { ...this.userData };
    } else {
      this.editedUserData = { ...this.userData };
    }
  }

  saveProfile() {
    console.log('=== SALVANDO PERFIL ===');

    let userId = this.userData.userId || this.userData.id;

    if (!userId) {
      userId = this.userService.getLoggedUserId() || '';
    }

    console.log('UserId para salvar:', userId);

    if (!userId) {
      this.showErrorMessage('ID do usuário não encontrado.');
      return;
    }

    this.isLoading = true;

    // Preservar o userId ao enviar
    const dataToSend = {
      ...this.editedUserData,
      userId: userId // Garante que userId é enviado
    };

    this.userService.updateUser(userId, dataToSend).subscribe({
      next: (user) => {
        console.log('✅ Perfil atualizado:', user);
        this.userData = user;
        this.editedUserData = { ...user };

        // Preservar userId no localStorage
        this.userService.setLoggedUserId(userId!);

        this.isLoading = false;
        this.isEditing = false;
        this.showSuccessMessage('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        console.error('❌ Erro ao salvar:', err);
        this.isLoading = false;
        this.showErrorMessage(`Erro ao salvar perfil: ${err.message}`);
      }
    });
  }

  deleteAccount(): void {
    let userId = this.userData.userId || this.userData.id;

    if (!userId) {
      userId = this.userService.getLoggedUserId() || '';
    }

    if (!userId) {
      this.showErrorMessage('ID do usuário não encontrado.');
      return;
    }

    const confirmed = confirm('Tem certeza de que deseja deletar sua conta? Esta ação não pode ser desfeita.');
    if (!confirmed) {
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        console.log('✅ Conta deletada:', response);
        this.showSuccessMessage('Conta deletada com sucesso!');
        this.authService.logout();
      },
      error: (err) => {
        console.error('❌ Erro ao deletar conta:', err);
        this.showErrorMessage('Erro ao deletar conta.');
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedUserData = { ...this.userData };
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
  // No configuracao-component.ts - método changePassword atualizado

  changePassword() {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;

      const userId = this.userService.getLoggedUserId();
      if (!userId) {
        this.showErrorMessage('Usuário não identificado. Faça login novamente.');
        this.isChangingPassword = false;
        return;
      }

      const passwordData: ChangePasswordRequest = this.passwordForm.value;

      this.userService.changePassword(userId, passwordData).subscribe({
        next: (response) => {
          console.log('✅ Senha alterada com sucesso:', response);
          this.isChangingPassword = false;
          this.showSuccessMessage('Senha alterada com sucesso!');
          this.closePasswordDialog();
          this.passwordForm.reset();
        },
        error: (err) => {
          console.error('❌ Erro ao alterar senha:', err);
          this.isChangingPassword = false;

          // Mensagens de erro específicas
          let errorMessage = 'Erro ao alterar senha.';

          if (err.status === 404) {
            errorMessage = 'Funcionalidade de alteração de senha não disponível no momento.';
          } else if (err.status === 400) {
            errorMessage = 'Senha atual incorreta ou nova senha inválida.';
          } else if (err.status === 401) {
            errorMessage = 'Não autorizado. Verifique suas credenciais.';
          } else if (err.message) {
            errorMessage = err.message;
          }

          this.showErrorMessage(errorMessage);
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros de validação
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  // Método auxiliar para marcar todos os campos como touched

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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
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
