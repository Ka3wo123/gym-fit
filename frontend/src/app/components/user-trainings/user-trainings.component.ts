import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GymUserService } from '../../services/gym-user.service';
import extractData from '../../utils/token-extractor';
import TrainingDto from '../../types/TrainingDto';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-trainings',
  standalone: true,
  imports: [
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    CommonModule
  ],
  templateUrl: './user-trainings.component.html',
  styleUrl: './user-trainings.component.scss'
})
export class UserTrainingsComponent {
  trainings: TrainingDto[] = [];
  displayedColumns: string[] = ['name', 'dateStart', 'workoutType', 'actions']

  constructor(
    private readonly _userService: GymUserService,
    private readonly _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchTrainings();
  }

  private fetchTrainings() {
    const data = extractData();
    if (data && data.email) {
      this._userService.getTrainingsForUser(data.email).subscribe((data: TrainingDto[]) => {
        this.trainings = data;
      });
    }
  }

  deleteTraining(trainingId: string) {
    if (confirm('Do you want to left this training?')) {
      const email = this._authService.getEmail();
      this._userService.deleteTrainingForUser(email!, trainingId).subscribe(() => {
        this.fetchTrainings()
      })
    }
  }
}
