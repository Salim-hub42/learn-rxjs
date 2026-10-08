import { Component } from '@angular/core';
import { HomeWidget} from '../../models/model-widgets';

@Component({
  selector: 'app-home-lab',
  imports: [],
  templateUrl: './home-lab.html',
  styleUrl: './home-lab.scss',
})
export class HomeLab {

  protected readonly widgets: HomeWidget[] = [
    {number: 1, title: 'Widget', label: 'Angular'},
    {number: 2, title: 'Widget', label: 'RxJS'},
    {number: 3, title: 'Widget', label: 'Pont'},
    {number: 4, title: 'Widget', label: 'Tests'},
  ]
}
