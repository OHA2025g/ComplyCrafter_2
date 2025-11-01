import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header>
        <h1>ComplyCrafter Portal</h1>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f5f5;
    }
    header {
      background: #1f3c88;
      color: white;
      padding: 1rem 2rem;
    }
    main {
      padding: 2rem;
    }
  `]
})
export class AppComponent {}
