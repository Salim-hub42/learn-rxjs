import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home-lab/home-lab').then((m) => m.HomeLab),
  },
];
