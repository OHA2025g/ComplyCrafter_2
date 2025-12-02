# ComplyCrafter Angular Frontend

Angular 17 frontend for ComplyCrafter, migrated from React with **strict separation of templates and styles**.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

```
angularFrontend/
├── src/
│   ├── app/
│   │   ├── auth/                    # Authentication components
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html    # Separate template
│   │   │   │   └── login.component.scss   # Separate styles
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.component.html    # Separate template
│   │   │   └── dashboard.component.scss    # Separate styles
│   │   ├── layout/
│   │   │   ├── layout.component.ts
│   │   │   ├── layout.component.html      # Separate template
│   │   │   └── layout.component.scss      # Separate styles
│   │   ├── shared/
│   │   │   └── sidebar/
│   │   │       ├── sidebar.component.ts
│   │   │       ├── sidebar.component.html  # Separate template
│   │   │       └── sidebar.component.scss  # Separate styles
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── guest.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html              # Separate template
│   │   ├── app.component.scss              # Separate styles
│   │   └── app.routes.ts
│   ├── config/
│   │   └── environment.ts
│   ├── styles/
│   │   ├── styles.scss
│   │   └── styles-beautiful.css
│   └── assets/
│       └── images/
├── angular.json
├── package.json
└── tsconfig.json
```

## ✅ Key Features

- **NO inline templates** - All templates in separate `.html` files
- **NO inline styles** - All styles in separate `.scss` files
- ✅ Authentication (Login, Signup, Forgot Password, Reset Password)
- ✅ Protected Routes with Guards
- ✅ HTTP Interceptors for Auth
- ✅ Dashboard with Stats and Calendar
- ✅ Sidebar Navigation
- ✅ Responsive Design

## 🔧 Configuration

Update `src/config/environment.ts` for API endpoints:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8100',
  gatewayUrl: 'http://localhost:8000',
  frontendUrl: 'http://localhost:4200'
};
```

## 📝 Notes

- This is a migration from React to Angular
- **Strictly follows the requirement: NO inline templates or styles**
- All components use `templateUrl` and `styleUrls` properties
- TypeScript is used for type safety
- Angular 17 standalone components



