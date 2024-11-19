import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    CommonModule

  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isTrainer: boolean = false;

  constructor(
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this._authService._authStatus.subscribe(status => this.isLoggedIn = status);
    this._authService._roleStatus.subscribe(role => this.isTrainer = role.includes('trainer'));
  }

  onLogout() {
    this._authService.clearTokens();
  }
}
