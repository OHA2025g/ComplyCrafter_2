// Import Zone.js for Angular change detection (MUST be first!)
import 'zone.js';

// Import Angular compiler for JIT compilation at runtime
import '@angular/compiler';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
