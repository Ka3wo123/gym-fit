import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GymUserService } from '../../services/gym-user.service';
import GymUser from '../../types/GymUser';
import { Role } from '../../types/Role';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-trainer-list',
  standalone: true,
  imports: [MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule],
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.scss'
})
export class TrainerListComponent {
  users = new MatTableDataSource<GymUser>();
  displayedColumns: string[] = ['name', 'surname', 'email'];

  constructor(private readonly _userService: GymUserService) { }

  ngOnInit(): void {
    this._userService.getAll(Role.TRAINER).subscribe(
      users => {
        this.users.data = users.data
      }
    );
  }
}
