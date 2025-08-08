# Drugstore Web

Frontend para la aplicación de gestión de inventario de farmacia desarrollado con React, TypeScript y Vite.

## Tecnologías

- React 19
- TypeScript
- Vite 7
- Tailwind CSS
- Shadcn UI
- TanStack Query (React Query)
- React Hook Form
- Zustand para gestión de estado
- Zod para validación

## Características

- Diseño moderno usando Atomic Design
- Componentes UI reutilizables con Shadcn UI
- Manejo eficiente de estado con Zustand
- Validación de formularios con Zod
- Fetcheo de datos optimizado con TanStack Query

## Estructura del proyecto

El proyecto sigue la estructura Atomic Design:

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

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Desarrollo

La aplicación está conectada a una API backend desarrollada en Django REST Framework.

## Reglas de desarrollo

- Usa nombres en kebab-case para archivos
- Usa PascalCase para componentes y tipos
- Usa camelCase para variables y funciones
- Documentación JSDoc para funciones públicas
- Componentes pequeños y de propósito único
- Estilo con Tailwind CSS