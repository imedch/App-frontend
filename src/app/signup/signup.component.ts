import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from '../service/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get username() { return this.signupForm.get('username'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      this.signupForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const { username, email, password } = this.signupForm.value;

    this.userService.getUserByEmail(email).subscribe({
      next: (usersByEmail) => {
        if (usersByEmail.length > 0) {
          this.errorMessage = 'This email is already used.';
          return;
        }

        this.userService.getUserByUsername(username).subscribe({
          next: (usersByUsername) => {
            if (usersByUsername.length > 0) {
              this.errorMessage = 'This username is already taken.';
              return;
            }

            // Save data in localStorage and redirect to confirmation
            localStorage.setItem('pendingUser', JSON.stringify({ username, email, password }));
            this.router.navigate(['/confirm-code'], { queryParams: { email, mode: 'signup' } });
          },
          error: () => {
            this.errorMessage = 'Error checking username uniqueness.';
          }
        });
      },
      error: () => {
        this.errorMessage = 'Error checking email uniqueness.';
      }
    });
  }
}
