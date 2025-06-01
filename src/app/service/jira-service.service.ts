import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JiraServiceService {
  private issuesUrl = 'http://localhost:8081/issues';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les offres Jira
  getIssues(): Observable<any[]> {
    return this.http.get<any[]>(this.issuesUrl);
  }

  // Exemple : soumettre une candidature (à adapter selon ton backend)
  submitApplication(data: any): Observable<any> {
    // Ici, tu pourrais POST sur une URL dédiée si tu en as une
    return this.http.post<any>('http://localhost:8081/applications', data);
  }
}
