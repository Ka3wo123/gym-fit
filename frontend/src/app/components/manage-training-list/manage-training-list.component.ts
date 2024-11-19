import { Component, OnInit } from '@angular/core';
import { GymUserService } from '../../services/gym-user.service';
import TrainingDto from '../../types/TrainingDto';
import { CommonModule } from '@angular/common';
import extractData from '../../utils/token-extractor';
import { TrainingService } from '../../services/training.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTrainingDialogComponent } from '../update-training/update-training.component';

@Component({
  selector: 'app-manage-training-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './manage-training-list.component.html',
  styleUrl: './manage-training-list.component.scss'
})
export class ManageTrainingListComponent implements OnInit {
  trainings?: TrainingDto[] = [];
  displayedColumns: string[] = ['name', 'type', 'workout', 'capacity'];
  searchTerm: string = '';

  constructor(
    private readonly _userService: GymUserService,
    private readonly _trainingService: TrainingService,
    private readonly _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    const data = extractData();
    if (data && data.email) {
      this._userService.getTrainingsForUser(data.email).subscribe((data: TrainingDto[]) => {
        this.trainings = data;
      });
    }
  }

  onUpdate(trainingId: string): void {
    const training = this.trainings?.find(t => t.id === trainingId);
    if (training) {
      const dialogRef = this._dialog.open(UpdateTrainingDialogComponent, {
        width: '400px',
        data: training
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadTrainings();
        }
      });
    }
  }

  onDelete(trainingId: string): void {
    if (confirm('Are you sure you want to delete this training?')) {
      this._trainingService.deleteTraining(trainingId).subscribe(() => {
        this.loadTrainings();
      });
    }
  }

  get filteredTrainings(): TrainingDto[] {
    return this.trainings?.filter(training => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        training.name.toLowerCase().includes(searchTermLower) ||
        training.workoutType.toLowerCase().includes(searchTermLower)
      );
    }) || [];
  }
}
