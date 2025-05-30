import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserServiceService } from '../service/user-service.service';
import { ManagerServiceService } from '../service/manager-service.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserServiceService,
    private managerService: ManagerServiceService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // ✅ Si l'utilisateur est déjà connecté, rediriger vers /home
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  // Getters pratiques pour le template
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

    console.log('🔐 Tentative de connexion :', { username, rememberMe });

    this.authenticateUser({ username, password }).subscribe({
      next: (response) => {
        console.log('✅ Connexion réussie :', response);
        this.loading = false;
        localStorage.clear();
        // ✅ Stockage du token, rôle, username et email
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('username', response.username); // <-- always from backend
        localStorage.setItem('email', response.email);       // <-- always from backend
        localStorage.setItem('lastCvName', response.lastcvName); // <-- always from backend
        localStorage.setItem('cvNote', response.CV_Note || '0'); // <-- always from backend
        
        if (rememberMe) {
          // Exemple : stocker dans localStorage pour persistance (déjà fait ci-dessus)
          console.log('📝 Session persistante activée');
        }

        // Rediriger vers la page d'accueil
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Échec de connexion :', error);
        this.errorMessage = 'Identifiants incorrects ou erreur serveur. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  /**
   * 🔐 Simule une authentification vers un backend (remplace cette méthode par un appel réel à ton API)
   */
  private authenticateUser(credentials: { username: string; password: string }): Observable<any> {
    return new Observable((observer) => {
      // Static admin check
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        observer.next({ token: 'fake-jwt-token', role: 'admin', username: 'admin', email: 'admin@actia-engineering.tn' });
        observer.complete();
        return;
      }

      // Helper to check a collection (users or managers)
      const checkCollection = (collection: string) => {
        const url = `http://localhost:8081/${collection}?${credentials.username.includes('@') ? 'email' : 'username'}=${credentials.username}&password=${credentials.password}`;
        this.http.get<any[]>(url).subscribe({
          next: (results) => {
            if (results.length > 0) {
              observer.next({
                token: 'fake-jwt-token',
                role: collection === 'managers' ? 'manager' : 'user',
                username: results[0].username,
                email: results[0].email
              });
              observer.complete();
            } else if (collection === 'users') {
              // If not found in users, check managers
              checkCollection('managers');
            } else {
              observer.error({ status: 401, message: 'Identifiants invalides' });
            }
          },
          error: (err) => {
            observer.error({ status: 500, message: 'Erreur serveur' });
          }
        });
      };

      // Start by checking users, then managers if not found
      checkCollection('users');
    });
  }
}
