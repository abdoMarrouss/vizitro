import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, User, ApiResponse } from '../models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  register(data: RegisterRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, data)
      .pipe(tap(response => this.handleAuthSuccess(response.data)));
  }

  login(data: LoginRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, data)
      .pipe(tap(response => this.handleAuthSuccess(response.data)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
    this.router.navigate(['/dashboard']);
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }
}