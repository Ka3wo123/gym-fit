import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AddTrainingComponent } from '../add-training/add-training.component';
import { ManageTrainingListComponent } from '../manage-training-list/manage-training-list.component';

@Component({
  selector: 'app-manage-training',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    AddTrainingComponent,    
    ManageTrainingListComponent
  ],
  templateUrl: './manage-training.component.html',
  styleUrl: './manage-training.component.scss'
})
export class ManageTrainingComponent {
  
}
