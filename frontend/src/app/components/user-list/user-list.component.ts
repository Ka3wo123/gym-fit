import { Component, OnInit } from '@angular/core';
import GymUser from '../../types/GymUser';
import { GymUserService } from '../../services/gym-user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Role } from '../../types/Role';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  users = new MatTableDataSource<GymUser>();
  displayedColumns: string[] = ['name', 'surname', 'email', 'age'];

  constructor(private readonly _userService: GymUserService) { }

  ngOnInit(): void {
    this._userService.getAll(Role.USER).subscribe(
      users => {        
        this.users.data = users.data
      }
    );    
  }

}
