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
  email!: string;
  trainings: TrainingDto[] = [];
  displayedColumns: string[] = ['name', 'dateStart', 'workoutType']

  constructor(private readonly _userService: GymUserService) {}

  ngOnInit(): void {
    const data = extractData();
    if (data && data.email) {
      this._userService.getTrainingsForUser(data.email).subscribe((data: TrainingDto[]) => {
        this.trainings = data;
      });
    }
  }
}
