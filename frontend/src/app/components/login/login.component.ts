import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GymUserService } from '../../../services/GymUserService';
import GymUserAuth from '../../../types/GymUserAuth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
      ],
  
})
export class LoginComponent {
  loginForm: FormGroup;
  userToAuth: GymUserAuth | null = null;

  constructor(private fb: FormBuilder,
    private readonly _userService: GymUserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userToAuth = this.loginForm.value as GymUserAuth;
      console.log('User to save:', this.userToAuth);
      this._userService.authenticateUser(this.userToAuth).subscribe({
        next: (response) => {
          localStorage.setItem("accessToken", response.token);
          localStorage.setItem("refreshToken", response.refreshToken);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        }
      });
    } else {
      console.log("Form isn't valid");
      console.log(this.loginForm.errors);
    }
  }
}
