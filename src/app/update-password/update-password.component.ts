import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Utilise le service utilisateur
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  email: string = '';
  code: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.updatePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.code = params['code'] || '';
    });
  }

  get newPassword() {
    return this.updatePasswordForm.get('newPassword');
  }

  onSubmit(): void {
    if (this.updatePasswordForm.invalid) {
      this.errorMessage = 'Please enter a valid password.';
      this.updatePasswordForm.markAllAsTouched();
      return;
    }

    const newPassword = this.updatePasswordForm.value.newPassword;

    // Utilise le service pour récupérer et mettre à jour l'utilisateur
    this.userService.getUserByEmail(this.email).subscribe({
      next: (users) => {
        if (users.length > 0) {
          const user = users[0];
          this.userService.updateUser(user.id, { password: newPassword }).subscribe({
            next: () => {
              this.successMessage = 'Password updated successfully!';
              this.errorMessage = null;
              setTimeout(() => this.router.navigate(['/log-in']), 1500);
            },
            error: () => {
              this.errorMessage = 'Failed to update password.';
              this.successMessage = null;
            }
          });
        } else {
          this.errorMessage = 'User not found.';
          this.successMessage = null;
        }
      },
      error: () => {
        this.errorMessage = 'Error searching for user.';
        this.successMessage = null;
      }
    });
  }
}