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
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
    ToastrModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  userToAuth: GymUserAuth | null = null;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _userService: GymUserService,
    private readonly _toastr: ToastrService,
    private readonly _router: Router

  ) {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.userToAuth = this.loginForm.value as GymUserAuth;
    this._userService.authenticateUser(this.userToAuth).subscribe({
      next: (response) => {
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
        this._toastr.success(`Successfully logged in`);
        this._router.navigate(['/'])
      },
      error: (error) => {
        console.log(error)
        if (error.error.statusCode === 401) {
          this._toastr.error(error.error.message);
        }
      }
    });

  }
}
