import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import UserAuth from '../../types/UserAuth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ToastrModule
  ]
})
export class LoginComponent {
  userLoginForm: FormGroup;
  selectedRole: string = 'user';

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _toastr: ToastrService,
    private readonly _router: Router
  ) {
    this.userLoginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

  }

  onTabChange(index: number): void {
    this.selectedRole = index === 0 ? 'user' : 'trainer';
  }

  onSubmit(role: string): void {
    const form =  this.userLoginForm;

    if (form.invalid) return;

    const userToAuth: UserAuth = form.value;

    this._authService.authenticateUser(userToAuth).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);        
        this._toastr.success(`Successfully logged in as ${role}`);
        this._router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        if (error.error.statusCode === 401) {
          this._toastr.error(error.error.message);
        }
      }
    });
  }
}
