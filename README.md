# Drugstore Web

Frontend for the pharmacy inventory management application built with React, TypeScript and Vite.

## Technologies

- React 19
- TypeScript
- Vite 7
- Tailwind CSS
- Shadcn UI
- TanStack Query (React Query)
- React Hook Form
- Zustand for state management
- Zod for validation

## Features

- Modern design using Atomic Design principles
- Reusable UI components with Shadcn UI
- Efficient state management with Zustand
- Form validation with Zod
- Optimized data fetching with TanStack Query

## Project Structure

The project follows the Atomic Design structure:

```
src/
  ├── components/
  │   ├── molecules/
  │   ├── organisms/
  │   └── ui/ (Shadcn UI)
  ├── lib/
  ├── hooks/
  ├── services/
  ├── store/
  └── types/
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Development

The application connects to a backend API built with Django REST Framework.

## Development Rules

- Use kebab-case for file names
- Use PascalCase for components and types
- Use camelCase for variables and functions
- JSDoc documentation for public functions
- Small, single-purpose components
- Styling with Tailwind CSS