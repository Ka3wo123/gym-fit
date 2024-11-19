import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GymUserResponse from '../types/GymUserResponse';
import { Role } from '../types/Role';
import { Training } from '../types/Training';
import { Observable } from 'rxjs';
import TrainerDto from '../types/TrainerDto';
import TrainingDto from '../types/TrainingDto';


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

  public getTrainingsForUser(email: string): Observable<TrainingDto[]> {
    return this.http.get<TrainingDto[]>(`${this.prefixURL}/${email}/trainings`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  public assignUserToTraining(userId: string | null, trainingId: string): Observable<Training> {
    return this.http.get<Training>(`${this.prefixURL}/${userId}/training/${trainingId}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

  private getToken() {
    return localStorage.getItem('accessToken');
  }

}