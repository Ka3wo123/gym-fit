import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../types/Training';
import TrainingResponse from '../types/TrainingResponse';
import TrainingDto from '../types/TrainingDto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private prefixURL: string = '/api/trainings';
  constructor(private http: HttpClient,
    private readonly _authService: AuthService
  ) { }

  getTrainings(): Observable<TrainingResponse> {
    return this.http.get<TrainingResponse>(`${this.prefixURL}`);
  }

  addTraining(training: TrainingDto) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.prefixURL}`, training, {
      headers
    });
  }

 

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
