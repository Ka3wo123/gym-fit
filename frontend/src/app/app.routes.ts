import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

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
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/registration/registration.component').then(m => m.RegistrationComponent)
    },
    {
        path: 'trainings',
        loadComponent: () => import('./components/training/training.component').then(m => m.TrainingComponent)
    },
    {
        path: 'trainings/manage',
        loadComponent: () => import('./components/manage-training/manage-training.component').then(m => m.ManageTrainingComponent)
    },
    {
        path: 'trainings/user',
        loadComponent: () => import('./components/user-trainings/user-trainings.component').then(m => m.UserTrainingsComponent)
    },
    {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
    }
];
