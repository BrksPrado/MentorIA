import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User } from './user.service';
import { AuthService } from '../../auth/auth.service'; // Importar AuthService

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

  // Inicialização correta
  userData: User = {} as User;
  editedUserData: User = {} as User;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService // Injetar AuthService
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

    // Debug: verificar userId no localStorage
    let loggedUserId = localStorage.getItem('loggedUserId');

    // Se não houver userId no localStorage, tentar extrair do token
    if (!loggedUserId) {
      console.log('userId não encontrado no localStorage, tentando extrair do token...');
      const userData = this.authService.getUserData();
      if (userData && userData.userId) {
        loggedUserId = userData.userId;
        // Salvar para uso futuro
        localStorage.setItem('loggedUserId', loggedUserId);
        console.log('userId extraído do token e salvo:', loggedUserId);
      }
    }

    console.log('=== DEBUG LOAD USER PROFILE ===');
    console.log('UserId no localStorage:', loggedUserId);
    console.log('Tipo do userId no localStorage:', typeof loggedUserId);

    this.userService.getLoggedUser().subscribe({
      next: (user) => {
        this.isLoading = false;
        console.log('=== DADOS RECEBIDOS DO BACKEND ===');
        console.log('Objeto user completo:', JSON.stringify(user, null, 2));
        console.log('user.userId:', user.userId);
        console.log('Tipo do user.userId:', typeof user.userId);

        this.userData = user;
        this.editedUserData = { ...user };

        console.log('=== APÓS ATRIBUIÇÃO ===');
        console.log('this.userData:', JSON.stringify(this.userData, null, 2));
        console.log('this.userData.userId:', this.userData.userId);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro completo ao carregar perfil do usuário:', err);
        console.error('Status do erro:', err.status);
        console.error('Mensagem do erro:', err.error);
        const errorMessage = err.message || 'Erro ao carregar dados do usuário.';
        this.error = errorMessage;
        this.showErrorMessage(errorMessage);
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
    console.log('=== INÍCIO DO MÉTODO SAVEPROFILE ===');
    console.log('1. Verificando editedUserData:', this.editedUserData);
    console.log('2. Verificando userData:', this.userData);
    console.log('3. userData completo:', JSON.stringify(this.userData, null, 2));
    console.log('4. Todas as propriedades de userData:', Object.keys(this.userData));
    console.log('5. this.userData.userId:', this.userData.userId);
    console.log('6. Tipo de this.userData.userId:', typeof this.userData.userId);
    console.log('7. this.userData["userId"]:', this.userData['userId']);

    if (!this.editedUserData || !this.userData) {
      console.error('ERRO: editedUserData ou userData é null/undefined');
      this.showErrorMessage('Dados de usuário não encontrados.');
      return;
    }

    // Tentar obter o userId de várias formas possíveis
    let userId = this.userData.userId;

    if (!userId) {
      console.warn('userId não encontrado em userData.userId, tentando alternativas...');

      // Tentar pegar do localStorage
      userId = localStorage.getItem('loggedUserId') || '';
      console.log('8. userId do localStorage:', userId);

      // Se ainda não tiver, tentar extrair do token
      if (!userId) {
        console.warn('userId não encontrado no localStorage, tentando extrair do token...');
        const tokenData = this.authService.getUserData();
        console.log('9. Dados extraídos do token:', tokenData);
        if (tokenData && tokenData.userId) {
          userId = tokenData.userId;
          console.log('10. userId extraído do token:', userId);
          // Atualizar o userData com o userId correto
          this.userData.userId = userId;
          localStorage.setItem('loggedUserId', userId);
        }
      } else {
        // Atualizar userData com o userId do localStorage
        this.userData.userId = userId;
      }
    }

    console.log('11. userId FINAL a ser usado:', userId);
    console.log('12. Tipo do userId FINAL:', typeof userId);

    if (!userId) {
      console.error('ERRO: Não foi possível obter o userId de nenhuma fonte');
      this.showErrorMessage('ID do usuário não encontrado. Por favor, faça login novamente.');
      return;
    }

    console.log('=== Iniciando atualização do perfil ===');
    console.log('UserId a ser usado:', userId);
    console.log('Dados a serem enviados:', this.editedUserData);

    this.isLoading = true;
    this.userService.updateUser(userId, this.editedUserData).subscribe({
      next: (user) => {
        this.isLoading = false;
        console.log('Perfil atualizado com sucesso!', user);
        this.userData = user;
        this.editedUserData = { ...user }; // atualiza a cópia
        this.showSuccessMessage('Perfil atualizado com sucesso!');
        this.isEditing = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('=== Erro ao atualizar perfil ===');
        console.error('Erro completo:', err);
        console.error('Status:', err.status);
        console.error('Status Text:', err.statusText);
        console.error('Erro retornado:', err.error);
        console.error('URL da requisição:', err.url);

        let errorMessage = 'Erro ao atualizar perfil. Verifique os dados e tente novamente.';
        if (err.status === 404) {
          errorMessage = 'Usuário não encontrado. Por favor, faça login novamente.';
        } else if (err.status === 400) {
          errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }

        this.showErrorMessage(errorMessage);
      }
    });
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
