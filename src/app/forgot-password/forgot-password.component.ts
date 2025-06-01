import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Getter for the email form control
  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const email = this.forgotPasswordForm.value.email;

    // Utilise le UserService pour chercher l'utilisateur par email
    this.userService.getUserByEmail(email).subscribe({
      next: (users) => {
        if (users.length > 0) {
          const user = users[0];
          // Générer un mot de passe aléatoire de 6 caractères
          const randomPassword = Math.random().toString(36).slice(-6);
          // Rediriger vers la page de mise à jour du mot de passe avec l'email en paramètre
          this.router.navigate(['/update-password'], { queryParams: { email, id: user.id, code: randomPassword } });
        } else {
          this.errorMessage = 'Email address not found.';
          this.successMessage = null;
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la recherche de l\'email.';
        this.successMessage = null;
      }
    });
  }
}
