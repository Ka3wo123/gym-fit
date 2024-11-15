import { Component, OnInit } from '@angular/core';
import { Training } from '../../types/Training';
import { TrainingService } from '../../services/training.service';
import { CommonModule } from '@angular/common';
import { GymUserService } from '../../services/gym-user.service';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss'
})
export class TrainingComponent implements OnInit {
  trainings: Training[] = [];

  constructor(private trainingService: TrainingService,
    private userService: GymUserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.trainingService.getTrainings().subscribe(response => this.trainings = response.data)
  }

  assignToTraining(trainingId: string): void {
    console.log(trainingId)
    const userId = this.authService.getEmail();
    this.userService.assignUserToTraining(userId, trainingId).subscribe({
      next: (training) => {
        this.toastr.success('Assigned to training');
      },
      error: (error) => {
        if (error.status == 409) {
          this.toastr.warning('User already assigned to this training');
        } else if (error.status === 403) {
          this.toastr.error('You have to login first');
        } else {
          this.toastr.error('Some error occured');
        }

      }
    });

  }

}
