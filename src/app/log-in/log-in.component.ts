import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Optional: Check if user is already logged in and redirect
    // e.g., if (localStorage.getItem('token')) { this.router.navigate(['/create-cv']); }
  }

  // Getters for form controls
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.loading = true;

    const { username, password, rememberMe } = this.loginForm.value;
    console.log('Login attempt:', { username, password, rememberMe });

    // Placeholder for backend authentication
    this.authenticateUser({ username, password }).subscribe({
      next: (response) => {
        console.log('✅ Login successful:', response);
        this.loading = false;
        // TODO: Store token or user data (e.g., localStorage.setItem('token', response.token))
        if (rememberMe) {
          // TODO: Implement persistent login (e.g., store in localStorage)
          console.log('Remember Me enabled');
        }
        this.router.navigate(['/home']); // Redirect to CV creation
      },
      error: (error) => {
        console.error('❌ Login failed:', error);
        this.errorMessage = 'Identifiants incorrects ou erreur serveur. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  // Simulate backend authentication (replace with actual API call)
  private authenticateUser(credentials: { username: string; password: string }): Observable<any> {
    return new Observable((observer) => {
      const staticUsername = 'admin';
      const staticPassword = 'admin123';

      setTimeout(() => {
        if (credentials.username === staticUsername && credentials.password === staticPassword) {
          observer.next({ token: 'fake-jwt-token' }); // Simulate a successful response
          observer.complete();
        } else {
          observer.error({ status: 401, message: 'Invalid credentials' }); // Simulate an error response
        }
      }, 1000); // Simulate a delay for the response
    });
  }
}