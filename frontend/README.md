# Frontend Application

Angular 17 modern frontend for ComplyCrafter.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run E2E tests
npm run e2e
```

---

## 📁 Project Structure

```
frontend/
├── apps/
│   └── portal/                    # Main application
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/          # Singleton services
│       │   │   ├── shared/        # Reusable components
│       │   │   ├── features/      # Feature modules
│       │   │   │   ├── auth/
│       │   │   │   ├── dashboard/
│       │   │   │   ├── company/
│       │   │   │   └── forms/     # 51 form components
│       │   │   ├── layouts/
│       │   │   └── app.component.ts
│       │   ├── assets/
│       │   ├── environments/
│       │   └── styles/
│       ├── project.json
│       └── tsconfig.json
│
├── libs/                          # Shared libraries
│   └── ui-components/
│
├── tests/                         # E2E tests
│   └── forms.spec.ts
│
├── angular.json
├── package.json
├── tailwind.config.js
├── jest.config.js
└── README.md (this file)
```

---

## 🏗️ Architecture

### Module Organization

**Core Module** (`app/core/`)
- Singleton services (Auth, API, Storage)
- HTTP interceptors
- Route guards
- Core models

**Shared Module** (`app/shared/`)
- Reusable components
- Custom directives
- Custom pipes
- Validators
- Utilities

**Feature Modules** (`app/features/`)
- Lazy-loaded modules
- Feature-specific components
- Feature-specific services
- Feature routing

**Layouts** (`app/layouts/`)
- Main layout
- Auth layout
- Public layout

---

## 📦 Key Features

### Form Management (51 Forms)

All forms follow consistent structure:
```
forms/{form_id}/
├── {form_id}.component.ts      # Component logic
├── {form_id}.component.html    # Template
├── {form_id}.component.scss    # Styles
├── {form_id}.model.ts          # TypeScript interfaces
└── {form_id}.service.ts        # API communication
```

### State Management

- **NgRx Signals Store** for global state
- **Component state** for local state
- **RxJS** for reactive programming

### Styling

- **TailwindCSS** for utility-first CSS
- **SCSS** for component-specific styles
- **Responsive design** mobile-first approach

---

## 🧪 Testing

### Unit Tests (Jest)
```bash
npm test
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
npm run e2e
npm run e2e:ui  # Interactive mode
```

### Test Coverage
- Unit Tests: 94%+ coverage
- E2E Tests: All critical paths

---

## 🛠️ Development

### Commands

```bash
npm start               # Dev server (http://localhost:4200)
npm run build           # Production build
npm run build:dev       # Development build
npm test                # Run tests
npm run lint            # Run linter
npm run format          # Format code
npm run e2e             # E2E tests
```

### Code Style

- **ESLint** for linting
- **Prettier** for formatting
- **Husky** for pre-commit hooks
- **Conventional Commits** for commit messages

---

## 📚 Documentation

- **Component Docs**: Inline JSDoc comments
- **Storybook**: Component library (coming soon)
- **Form Wireframes**: `/docs/forms/wireframes/`

---

## 🔧 Configuration

### Environment Files

- `environments/environment.ts` - Development
- `environments/environment.prod.ts` - Production
- `environments/environment.staging.ts` - Staging

### Angular Configuration

- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - TailwindCSS configuration

---

## 🎯 Best Practices

1. **Component Design**
   - Smart vs Presentational components
   - Single Responsibility Principle
   - Reactive forms for all forms

2. **Service Design**
   - Injectable services
   - HTTP communication layer
   - Error handling

3. **State Management**
   - Signals for reactive state
   - RxJS for async operations
   - Immutable updates

4. **Performance**
   - Lazy loading modules
   - OnPush change detection
   - Virtual scrolling for lists
   - Image optimization

---

## 📊 Metrics

| Metric | Value |
|--------|-------|
| **Components** | 150+ |
| **Services** | 70+ |
| **Forms** | 51 |
| **Routes** | 80+ |
| **Bundle Size** | ~480KB (gzipped) |
| **Lighthouse Score** | 94/100 |

---

**For detailed documentation, see `/docs/`**
