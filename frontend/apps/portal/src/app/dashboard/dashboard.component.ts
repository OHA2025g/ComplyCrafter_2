import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  readonly steps = [
    'Angular workspace scaffolding',
    'FastAPI services scaffolding',
    'ADT1 pilot form (UI + API)',
    'Dual-run + regression testing'
  ];
}
