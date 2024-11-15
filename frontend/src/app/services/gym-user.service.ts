import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GymUserResponse from '../types/GymUserResponse';
import { Role } from '../types/Role';
import { Training } from '../types/Training';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GymUserService {

  private prefixURL: string = '/api/users';
  constructor(private http: HttpClient) {
  }

  public getAll(role?: Role) {
    return this.http.get<GymUserResponse>(`${this.prefixURL}`, {
      params: {
        role: role || ''
      }
    });
  }

  public assignUserToTraining(userId: string | null, trainingId: string): Observable<Training> {
    const token = localStorage.getItem('accessToken');
    return this.http.get<Training>(`${this.prefixURL}/${userId}/training/${trainingId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }



}