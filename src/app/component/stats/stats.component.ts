import { Component, Input } from '@angular/core';
import { Stats } from '../../interfaces/stats';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {
  @Input() stats?: Stats;
}
