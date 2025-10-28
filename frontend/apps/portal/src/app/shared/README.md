# Shared Module

This module contains reusable components, directives, and pipes used across the application.

---

## 📁 Structure

```
shared/
├── components/            # Shared components
│   ├── form-field/
│   ├── data-table/
│   ├── file-upload/
│   ├── date-picker/
│   └── loading-spinner/
│
├── directives/            # Custom directives
│   ├── autofocus.directive.ts
│   └── click-outside.directive.ts
│
├── pipes/                 # Custom pipes
│   ├── date-format.pipe.ts
│   ├── currency-format.pipe.ts
│   └── text-truncate.pipe.ts
│
├── models/                # Shared models
│   └── common.models.ts
│
├── validators/            # Custom validators
│   ├── cin.validator.ts
│   ├── pan.validator.ts
│   └── din.validator.ts
│
└── README.md (this file)
```

---

## 🎯 Purpose

The shared module contains:
- **Components** that are reused across features
- **Directives** for DOM manipulation
- **Pipes** for data transformation
- **Validators** for form validation
- **Utilities** used by multiple features

---

## ✅ Guidelines

- Components here should be stateless/presentational
- No business logic, only presentation
- Can be imported by any feature module
- Keep components generic and reusable

