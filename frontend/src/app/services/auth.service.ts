import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import AuthResponse from '../types/AuthResponse';
import UserAuth from '../types/UserAuth';
import GymUserRegistration from '../types/GymUserRegistration';
import TrainerDto from '../types/TrainerDto';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private prefixURL: string = '/api/auth';
    _authStatus = new BehaviorSubject<boolean>(false);
    _roleStatus = new BehaviorSubject<string>('');
    
    constructor(
        private readonly _http: HttpClient,
        private readonly router: Router

    ) { 
        this.initializeAuthState();
    }

    private initializeAuthState(): void {
        const token = this.getAccessToken();
        if (token && !this.isTokenExpired(token)) {
            this._authStatus.next(true);
            this._roleStatus.next(this.getUserRole());
        }
    }

    public refresh(refreshToken: string): Observable<any> {
        return this._http.post<any>(`${this.prefixURL}/refresh`, { refreshToken });
    }

    public authenticateUser(user: UserAuth): Observable<AuthResponse> {
        return this._http.post<AuthResponse>(`/api/auth/login`, user).pipe(
            tap((response: AuthResponse) => {
                this.setTokens(response.token, response.refreshToken);
                this._authStatus.next(true);
                this._roleStatus.next(this.getUserRole());
            })
        );

    }

    public createUser(user: GymUserRegistration) {
        return this._http.post<GymUserRegistration>(`/api/auth/register`, user);
    }

    public createTrainer(trainer: TrainerDto) {
        return this._http.post<TrainerDto>(`/api/auth/register`, trainer);
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
        this._authStatus.next(false);
        this._roleStatus.next('');
        this.router.navigate(['/']);
    }
}


