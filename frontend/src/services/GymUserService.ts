import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GymUserResponse from '../types/GymUserResponse';
import GymUser from '../types/GymUser';
import GymUserRegistration from '../types/GymUserRegistration';
import GymUserAuth from '../types/GymUserAuth';
import { Observable } from 'rxjs';
import AuthResponse from '../types/AuthResponse';


@Injectable({
  providedIn: 'root'
})
export class GymUserService {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  public getAll() {
    return this.http.get<GymUserResponse>(`${this.url}/api/users`);
  }

  public authenticateUser(user: GymUserAuth): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/api/auth/login`, user);
    
  }
  public createUser(user: GymUserRegistration) {
    return this.http.post<GymUserRegistration>(`${this.url}/api/auth/register`, user);
  }
  
}