import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';
import { TrainingComponent } from './components/training/training.component';
import { ManageTrainingComponent } from './components/manage-training/manage-training.component';
import { UserTrainingsComponent } from './components/user-trainings/user-trainings.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'users',
        loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent)
    },
    {
        path: 'trainers',
        loadComponent: () => import('./components/trainer-list/trainer-list.component').then(m => m.TrainerListComponent)
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegistrationComponent
    },
    {
        path: 'trainings',
        component: TrainingComponent
    },
    {
        path: 'trainings/manage',
        component: ManageTrainingComponent
    },
    {
        path: 'trainings/user',
        component: UserTrainingsComponent
    },
    {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
    }
];
