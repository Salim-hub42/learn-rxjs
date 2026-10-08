import { Component } from '@angular/core';
import { HomeWidget } from '../../models/model-widgets';

@Component({
  selector: 'app-home-lab',
  imports: [],
  templateUrl: './home-lab.html',
  styleUrl: './home-lab.scss',
})
export class HomeLab {
  protected readonly widgets: HomeWidget[] = [
    { number: 1, title: 'Architecture et outillage', label: 'Angular' },
  ];
}
