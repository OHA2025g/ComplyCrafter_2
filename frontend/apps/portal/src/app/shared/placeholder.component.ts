import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-container">
      <div class="placeholder-header">
        <h1>{{ icon }} {{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="placeholder-content">
        <div class="info-message">
          <div class="icon-large">🚧</div>
          <h2>Coming Soon</h2>
          <p>This feature is currently under development and will be available in the next release.</p>
          <div class="features-list">
            <h3>Planned Features:</h3>
            <ul>
              <li>Data management interface</li>
              <li>Search and filter capabilities</li>
              <li>Export and reporting tools</li>
              <li>Audit trail and history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .placeholder-container { padding: 2rem; max-width: 1200px; margin: 0 auto; animation: fadeInUp 0.5s ease-out; }
    .placeholder-header { background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05)); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    h1 { font-size: 2.3rem; font-weight: 800; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 0.5rem 0; }
    .subtitle { color: #6c757d; font-size: 1.05rem; margin: 0; }
    .placeholder-content { background: white; border-radius: 16px; padding: 3rem; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .info-message { text-align: center; max-width: 600px; margin: 0 auto; }
    .icon-large { font-size: 5rem; margin-bottom: 1.5rem; opacity: 0.6; }
    h2 { font-size: 2rem; font-weight: 700; color: #2c3e50; margin: 0 0 1rem 0; }
    p { color: #6c757d; font-size: 1.1rem; margin-bottom: 2rem; }
    .features-list { text-align: left; background: #f8f9fa; border-radius: 12px; padding: 2rem; margin-top: 2rem; }
    h3 { font-size: 1.2rem; font-weight: 700; color: #2c3e50; margin: 0 0 1rem 0; }
    ul { color: #6c757d; padding-left: 1.5rem; margin: 0; }
    li { margin-bottom: 0.75rem; }
  `]
})
export class PlaceholderComponent {
  @Input() title: string = 'Page';
  @Input() subtitle: string = 'This page is under development';
  @Input() icon: string = '📄';
}

