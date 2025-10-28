import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cc-card',
  standalone: true,
  template: `
    <section class="cc-card">
      <header *ngIf="title">
        <h3>{{ title }}</h3>
        <ng-content select="[card-subtitle]"></ng-content>
      </header>
      <div class="cc-card__content">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [
    `
      .cc-card {
        border-radius: 1rem;
        padding: 1.5rem;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      header {
        margin-bottom: 1rem;
      }
      h3 {
        margin: 0;
        font-size: 1.25rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcCardComponent {
  @Input() title = '';
}
