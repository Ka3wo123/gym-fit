import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { WorkoutType } from '../../../types/WorkoutType';
import { trigger, transition, style, animate } from '@angular/animations';
import { GymUserService } from '../../../services/GymUserService';
import GymUserRegistration from '../../../types/GymUserRegistration';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
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
  userToSave: GymUserRegistration | null = null

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _userService: GymUserService,
    private readonly _toastr: ToastrService

  ) {
    this.registrationForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      workoutType: [''],
      age: [null, [Validators.min(18), Validators.max(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.userToSave = this.registrationForm.value as GymUserRegistration;
    this._userService.createUser(this.userToSave).subscribe({
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

  }
}
