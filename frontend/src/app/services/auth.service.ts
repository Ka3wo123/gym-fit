import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import AuthResponse from '../types/AuthResponse';
import UserAuth from '../types/UserAuth';
import GymUserRegistration from '../types/GymUserRegistration';
import TrainerDto from '../types/TrainerDto';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private prefixURL: string = '/api/auth';
    constructor(private http: HttpClient) { }

    public refresh(refreshToken: string): Observable<any> {
        return this.http.post<any>(`${this.prefixURL}/refresh`, { refreshToken });
    }

    public authenticateUser(user: UserAuth): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`/api/auth/login`, user);

    }

    public createUser(user: GymUserRegistration) {
        return this.http.post<GymUserRegistration>(`/api/auth/register`, user);
    }

    public createTrainer(trainer: TrainerDto) {
        return this.http.post<TrainerDto>(`/api/auth/register`, trainer);
    }

    public isLoggedIn(): boolean {
        const token = localStorage.getItem('refreshToken');
        return !!token && !this.isTokenExpired(token);
    }

    public getUserRole(): string {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decoded: any = jwtDecode(token);
            return decoded?.role || '';
        }
        return '';
    }

    private isTokenExpired(token: string): boolean {
        const decoded: any = jwtDecode(token);
        const expirationDate = decoded?.exp * 1000;
        return expirationDate < Date.now();
    }

    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    getEmail(): string | null {
        const token = localStorage.getItem('accessToken');
    
        if (token) {
          const decodedToken: any = jwtDecode(token);
          return decodedToken?.email || null;
        }
        return null;
      }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }



    clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}


