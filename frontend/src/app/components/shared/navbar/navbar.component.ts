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
    private _authService: AuthService,
    private _cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkUserStatus();
  }

  checkUserStatus() {
    this.isLoggedIn = this._authService.isLoggedIn();

    this.isTrainer = this._authService.getUserRole() === 'trainer';

    this._cdRef.detectChanges();
  }

  onLogout() {
    this._authService.clearTokens();
    this.isLoggedIn = false;
    this.isTrainer = false;

    this._cdRef.detectChanges();
  }
}
