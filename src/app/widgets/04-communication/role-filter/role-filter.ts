import { Component, model } from '@angular/core';
import { RoleFilterValue } from './role-filter-model';

@Component({
  selector: 'app-role-filter',
  imports: [],
  templateUrl: './role-filter.html',
  styleUrl: './role-filter.scss',
})
export class RoleFilter {
  readonly role = model<RoleFilterValue>('all');

  protected readonly roleOptions: { value: RoleFilterValue; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'sniper', label: 'Sniper' },
    { value: 'assault', label: 'Combattant' },
    { value: 'engineer', label: 'Ingénieur' },
    { value: 'medic', label: 'Médecin' },
  ];

  protected selectRole(value: RoleFilterValue): void {
    this.role.set(value);
  }
}
