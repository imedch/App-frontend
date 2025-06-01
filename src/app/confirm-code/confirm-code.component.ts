import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.component.html'
})
export class ConfirmCodeComponent {
  email: string = '';
  code: string = '';
  errorMessage: string | null = null;
  resendSuccessMessage: string | null = null;
  loading: boolean = false;
  codeInvalid: boolean = false;
  mode: string = 'signup'; // default

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService
  ) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.mode = params['mode'] || 'signup';
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.codeInvalid = false;

    if (!this.code.trim()) {
      this.codeInvalid = true;
      return;
    }

    this.loading = true;

    if (this.code === '123456') {
      if (this.mode === 'signup') {
        const userData = JSON.parse(localStorage.getItem('pendingUser') || '{}');

        if (userData && userData.username && userData.email && userData.password) {
          this.userService.createUser(userData).subscribe({
            next: () => {
              localStorage.removeItem('pendingUser');
              this.loading = false;
              this.router.navigate(['/log-in']);
            },
            error: () => {
              this.loading = false;
              this.errorMessage = 'Signup failed. Please try again.';
            }
          });
        } else {
          this.loading = false;
          this.router.navigate(['/log-in']);
        }
      } else if (this.mode === 'forget') {
        this.loading = false;
        this.router.navigate(['/update-password'], { queryParams: { email: this.email } });
      }
    } else {
      this.loading = false;
      this.errorMessage = 'Code de confirmation invalide. Veuillez réessayer.';
    }
  }

  resendCode(event: Event) {
    event.preventDefault();
    this.resendSuccessMessage = null;
    this.errorMessage = null;

    this.userService.resendConfirmationCode(this.email).subscribe({
      next: () => {
        this.resendSuccessMessage = 'Un nouveau code a été envoyé à votre adresse email.';
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l’envoi du code. Veuillez réessayer.';
      }
    });
  }

  updatePassword(user: any, newPassword: string) {
    this.userService.updateUser(user.id, { password: newPassword }).subscribe({
      next: () => {
        this.router.navigate(['/log-in']);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la mise à jour du mot de passe. Veuillez réessayer.';
      }
    });
  }
}
