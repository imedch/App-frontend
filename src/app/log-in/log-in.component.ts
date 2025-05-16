import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
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
  returnUrl: string = '/home';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    
    // If already logged in, redirect to returnUrl
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.loading = true;

    const { username, password, rememberMe } = this.loginForm.value;

    this.authenticateUser({ username, password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials or server error. Please try again.';
        this.loading = false;
      }
    });
  }

  private authenticateUser(credentials: { username: string; password: string }): Observable<any> {
    // Replace this with actual API call
    return new Observable((observer) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          observer.next({ token: 'fake-jwt-token' });
        } else {
          observer.error({ status: 401 });
        }
        observer.complete();
      }, 1000);
    });
  }
}