import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WorkoutType } from '../../types/WorkoutType';
import extractData from '../../utils/token-extractor';

@Component({
  selector: 'app-add-training',
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _trainingService: TrainingService,
    private readonly _toastr: ToastrService
  ) {
    this.trainingForm = this._fb.group({
      name: ['', Validators.required],
      workoutType: ['', Validators.required],
      dateStart: ['', Validators.required],
      capacity: [null]
    });
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      const token = extractData();
      if (token?.email) {
        this._trainingService.addTraining(this.trainingForm.value).subscribe({
          next: () => {
            this._toastr.success('Training added successfully');
          },
          error: () => {
            this._toastr.error('Error adding training');
          }
        });
      } else {
        console.log("Email not found")
      }
    }
  }
}
