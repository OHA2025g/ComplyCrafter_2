# ComplyCrafter React Frontend

React.js frontend for ComplyCrafter, migrated from Angular.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
reactFrontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx       # Main layout with sidebar and header
│   │   ├── Layout.css
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Sidebar.css
│   │   ├── ProtectedRoute.tsx
│   │   └── GuestRoute.tsx
│   ├── pages/               # Page components
│   │   ├── auth/           # Authentication pages
│   │   │   ├── Login.tsx
│   │   │   ├── Login.css
│   │   │   ├── Signup.tsx
│   │   │   ├── Signup.css
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ForgotPassword.css
│   │   │   ├── ResetPassword.tsx
│   │   │   └── ResetPassword.css
│   │   └── Dashboard.tsx
│   │   └── Dashboard.css
│   ├── services/           # Services
│   │   └── auth.service.ts
│   ├── utils/              # Utilities
│   │   └── axios.ts        # Axios instance with interceptors
│   ├── config/             # Configuration
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles/             # Global styles
│   │   └── styles-beautiful.css
│   ├── App.tsx             # Main app component with routing
│   └── main.tsx            # Entry point
├── public/                 # Static assets
│   └── images/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🏗️ Architecture

### Component Structure
- **HTML and CSS are kept separate** as requested
- Each component has its own `.tsx` file and `.css` file
- Components use functional components with React Hooks

### Routing
- Uses React Router v6
- Protected routes require authentication
- Guest routes redirect authenticated users

### Services
- Auth service handles authentication logic
- Axios instance configured with interceptors for auth tokens

### State Management
- Uses React hooks (useState, useEffect) for local state
- Context API can be added for global state if needed

## 📦 Key Features

- ✅ Authentication (Login, Signup, Forgot Password, Reset Password)
- ✅ Protected Routes
- ✅ Dashboard with stats and calendar
- ✅ Sidebar Navigation
- ✅ Responsive Design
- ✅ Beautiful UI with gradients and animations

## 🔧 Configuration

Update `src/config/environment.ts` for API endpoints:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8100',
  gatewayUrl: 'http://localhost:8000',
  frontendUrl: 'http://localhost:3000'
};
```

## 📝 Notes

- This is a migration from Angular to React
- HTML and CSS files are kept separate as requested
- All components follow React best practices
- TypeScript is used for type safety



