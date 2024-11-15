import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WorkoutType } from '../../types/WorkoutType';

@Component({
  selector: 'app-add-training',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.scss'
})
export class AddTrainingComponent {
  trainingForm: FormGroup;
  workoutTypes = Object.values(WorkoutType);

  constructor(private fb: FormBuilder, private trainingService: TrainingService) {
    this.trainingForm = this.fb.group({
      name: ['', Validators.required],
      workoutType: ['', Validators.required],
      dateStart: ['', Validators.required],
      capacity: [null]
    });
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      this.trainingService.addTraining(this.trainingForm.value).subscribe({
        next: (response) => {
          console.log('Training added successfully:', response);
          this.trainingForm.reset();
        },
        error: (error) => {
          console.error('Error adding training:', error);
        }
      });
    }
  }
}
