# CollectorOS Web

Frontend de CollectorOS construido con React, Vite y MUI.

## Stack
- React
- Vite
- MUI
- React Router
- React Query
- Axios

## Arquitectura
- `app/`: configuración global
- `features/`: módulos del sistema
- `services/`: cliente HTTP y query client
- `components/`: componentes compartidos
- `hooks/`: hooks globales
- `utils/`: helpers

## Filosofía
- Las páginas orquestan
- Los componentes renderizan UI
- Los hooks encapsulan lógica
- `api/` concentra llamadas HTTP
- Se evita mezclar lógica de negocio con JSX

## Estructura de ramas
- `main`: rama estable
- `develop`: rama de integración
- `feature/*`: nuevas funcionalidades
- `fix/*`: correcciones
- `refactor/*`: mejoras internas

## Comandos
```bash
npm install
npm run dev
npm run build
```

## Variables de entorno
```bash
VITE_API_URL=http://localhost:3000/api/v1
```

## Roadmap

 Base inicial con Vite

 Router

 MUI

 React Query

 App layout

 Auth

 Dashboard

 Inventory

 Wishlist

 Analytics

 Alerts

 Forecast