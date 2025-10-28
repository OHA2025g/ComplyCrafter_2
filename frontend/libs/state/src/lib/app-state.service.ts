import { Injectable, Signal, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly phase = signal<'phase0' | 'phase1' | 'phase2'>('phase0');
  readonly statusLabel: Signal<string> = computed(() => {
    switch (this.phase()) {
      case 'phase1':
        return 'Pilot Form Migration';
      case 'phase2':
        return 'Domain Rollout';
      default:
        return 'Foundation Work';
    }
  });

  setPhase(phase: 'phase0' | 'phase1' | 'phase2'): void {
    this.phase.set(phase);
  }
}
