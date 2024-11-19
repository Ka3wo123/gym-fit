import { Component, OnInit } from '@angular/core';
import { Training } from '../../types/Training';
import { TrainingService } from '../../services/training.service';
import { CommonModule } from '@angular/common';
import { GymUserService } from '../../services/gym-user.service';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { jwtDecode } from 'jwt-decode';
import { MatTooltipModule } from '@angular/material/tooltip';
import TrainingDto from '../../types/TrainingDto';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss'
})
export class TrainingComponent implements OnInit {
  trainings: TrainingDto[] = [];
  isTrainer: boolean = false;

  constructor(
    private readonly _trainingService: TrainingService,
    private readonly _userService: GymUserService,
    private readonly _authService: AuthService,
    private readonly _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded: { role: string } = jwtDecode(token);
      this.isTrainer = decoded.role.includes('trainer');
    }
    this._trainingService.getTrainings().subscribe(response => this.trainings = response.data)
  }

  assignToTraining(trainingId: string): void {
    const userId = this._authService.getEmail();
    this._userService.assignUserToTraining(userId, trainingId).subscribe({
      next: () => {
        this._toastr.success('Assigned to training');
      },
      error: (error) => {
        if (error.status == 409) {
          this._toastr.warning('User already assigned to this training');
        } else if (error.status === 403) {
          this._toastr.error('You have to login first');
        } else {
          this._toastr.error('Some error occured');
        }

      }
    });

  }

}
