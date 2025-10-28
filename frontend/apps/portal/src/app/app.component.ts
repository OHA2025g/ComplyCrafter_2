import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CcCardComponent } from '@frontend/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CcCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly title = 'ComplyCrafter Portal';
}
