import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WorkoutType } from '../../types/WorkoutType';
import GymUserRegistration from '../../types/GymUserRegistration';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import TrainerDto from '../../types/TrainerDto';
import { Role } from '../../types/Role';

@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTabsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ToastrModule
  ]
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  workoutTypes: WorkoutType[] = Object.values(WorkoutType);
  userToSave: GymUserRegistration | null = null;
  selectedTab: number = 0;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _toastr: ToastrService
  ) {
    this.registrationForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      workoutType: [null],
      age: [null, [Validators.min(18), Validators.max(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  
  onTabChange(event: any) {
    this.selectedTab = event.index;
  }

  onSubmit() {
    this.userToSave = this.registrationForm.value as GymUserRegistration;

    if (this.selectedTab === 0) {      
      this._authService.createUser(this.userToSave).subscribe({
        next: () => {
          this._toastr.success(`Successfully created account for ${this.userToSave?.name}`);
        },
        error: (error) => {
          if (Array.isArray(error.error.message)) {
            error.error.message.forEach((msg: string) => {
              this._toastr.error(msg, 'Failed to create account');
            });
          } else {
            this._toastr.error('Failed to create account', 'Error');
          }
        }
      });
    } else if (this.selectedTab === 1) {
      const trainer: TrainerDto = this.registrationForm.value;
      trainer.role = Role.TRAINER;
      this._authService.createTrainer(trainer).subscribe({
        next: () => {
          this._toastr.success(`Successfully created trainer account for ${trainer.name}`);
        },
        error: (error) => {
          if (Array.isArray(error.error.message)) {
            error.error.message.forEach((msg: string) => {
              this._toastr.error(msg, 'Failed to create account');
            });
          } else {
            this._toastr.error('Failed to create account', 'Error');
          }
        }
      });
    }
  }
}
