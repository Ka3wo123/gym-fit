import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import TrainingDto from '../../types/TrainingDto';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WorkoutType } from '../../types/WorkoutType';

@Component({
  selector: 'app-update-training',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  standalone: true,
  templateUrl: './update-training.component.html',
  styleUrls: ['./update-training.component.scss']
})
export class UpdateTrainingDialogComponent {
  trainingForm: FormGroup;
  workoutTypes = Object.values(WorkoutType);

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _trainingService: TrainingService,
    private readonly _dialogRef: MatDialogRef<UpdateTrainingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainingDto
  ) {    
    this.trainingForm = this._fb.group({
      name: [this.data.name, Validators.required],
      workoutType: [this.data.workoutType, Validators.required],
      dateStart: [this.data.dateStart, Validators.required],
      capacity: [this.data.capacity],
    });
  }

  onSave(): void {
    if (this.trainingForm.valid) {
      const updatedTraining = this.trainingForm.value;
      this._trainingService.updateTraining(this.data.id, updatedTraining).subscribe(() => {
        this._dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this._dialogRef.close();
  }
}
