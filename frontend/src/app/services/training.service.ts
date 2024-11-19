import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import TrainingResponse from '../types/TrainingResponse';
import TrainingDto from '../types/TrainingDto';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private prefixURL: string = '/api/trainings';
  private trainingUpdate = new Subject<void>();
  trainingUpdate$ = this.trainingUpdate.asObservable();

  constructor(private http: HttpClient,
  ) { }

  getTrainings(): Observable<TrainingResponse> {
    return this.http.get<TrainingResponse>(`${this.prefixURL}`);
  }

  addTraining(email: string, training: TrainingDto) {
    const headers = this.getAuthHeaders();

    return this.http.post(`${this.prefixURL}?email=${email}`, training, {
      headers
    }).pipe(
      tap(() => this.trainingUpdate.next())
    );
  }


  updateTraining(id: string, trainingToUpdate: TrainingDto) {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.prefixURL}/${id}`, trainingToUpdate, {
      headers
    })
  }

  deleteTraining(id: string) {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.prefixURL}/${id}`, {
      headers
    })
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }


}
