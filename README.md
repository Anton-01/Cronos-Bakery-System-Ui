# Cronos Bakery System - Frontend

[![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?style=flat&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-20+-339933?style=flat&logo=node.js)](https://nodejs.org/)

> Aplicación web frontend profesional para la gestión integral de panaderías. Construida con Angular 20, TypeScript, Angular Material y NgRx.

## 🎯 Descripción

Sistema completo para la gestión de panaderías que permite gestionar materias primas, recetas, cotizaciones, inventario y personalización empresarial. Consume la API REST del backend Cronos Bakery System.

## ✨ Características Principales

- ✅ **Autenticación JWT** con refresh token automático
- ✅ **Two-Factor Authentication (2FA)** con códigos TOTP
- ✅ **Gestión de Materias Primas** con historial de precios
- ✅ **Recetas con Versionado** y cálculo automático de costos
- ✅ **Cotizaciones Compartibles** con enlace público
- ✅ **Exportación a PDF** de cotizaciones y recetas
- ✅ **Sistema de Notificaciones** en tiempo real
- ✅ **Tema Claro/Oscuro/Auto** personalizable
- ✅ **Responsive Design** (móvil, tablet, desktop)

## 🛠 Stack Tecnológico

- **Angular 20.3** - Framework principal
- **TypeScript 5.9** - Lenguaje de programación
- **Angular Material 20.2** - Componentes UI
- **NgRx 20.1** - State management
- **RxJS 7.8** - Programación reactiva
- **SCSS** - Preprocesador CSS

## 📦 Requisitos Previos

- **Node.js**: 20+ LTS
- **npm**: 10+
- **Docker**: 20+ (opcional)

## 🚀 Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd Cronos-Bakery-System-Ui

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

## 💻 Scripts Disponibles

```bash
# Desarrollo
npm start              # Servidor de desarrollo
npm run build          # Build de desarrollo
npm run build:prod     # Build de producción

# Testing
npm test               # Tests unitarios
npm run test:ci        # Tests en modo CI
npm run test:coverage  # Tests con cobertura

# Linting y Formateo
npm run lint           # Ejecutar ESLint
npm run lint:fix       # Corregir errores de linting
npm run format         # Formatear código con Prettier
npm run format:check   # Verificar formateo

# Análisis
npm run analyze        # Analizar tamaño del bundle
```

## 🐳 Docker

```bash
# Build imagen
docker build -f docker/Dockerfile -t cronos-frontend .

# Ejecutar contenedor
docker run -p 4200:80 cronos-frontend

# Docker Compose
cd docker && docker-compose up -d
```

## 📁 Estructura del Proyecto

```
src/app/
├── core/              # Servicios singleton, guards, interceptors
│   ├── guards/        # Auth, Role, Guest guards
│   ├── interceptors/  # Auth, Error, Loading interceptors
│   └── services/      # Auth, Storage, Notification, Theme
├── shared/            # Componentes y modelos compartidos
│   └── models/        # Interfaces TypeScript de la API
├── features/          # Módulos de funcionalidades (lazy loaded)
│   ├── auth/
│   ├── dashboard/
│   ├── raw-materials/
│   ├── recipes/
│   ├── quotes/
│   └── settings/
└── layout/            # Componentes de layout
```

## 🔐 Seguridad

- **JWT** con expiración de 15 minutos
- **Refresh Tokens** con expiración de 7 días
- **2FA** con TOTP (Google Authenticator)
- Tokens en **sessionStorage** (más seguro)
- **HTTP Interceptors** para manejo automático de tokens
- **Route Guards** para protección de rutas

## 🌐 Configuración de API

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1', // URL de tu backend
};
```

## 📝 Estado Actual del Proyecto

### ✅ Completado (Fase 1 - Core)

- [x] Proyecto Angular 20 configurado
- [x] Estructura de carpetas según Clean Architecture
- [x] Modelos TypeScript completos de la API
- [x] Servicios core (Auth, Storage, Notification, Theme)
- [x] Interceptors HTTP (Auth, Error, Loading)
- [x] Guards de ruta (Auth, Role, Guest)
- [x] Configuración de estilos globales (SCSS)
- [x] Configuración Docker completa
- [x] ESLint, Prettier y Husky configurados

### 🚧 Pendiente (Fases Siguientes)

- [ ] Componentes de Layout (Header, Sidebar, Footer)
- [ ] Módulo de Autenticación (Login, Register, 2FA)
- [ ] Dashboard con estadísticas
- [ ] Módulos de funcionalidades (Raw Materials, Recipes, Quotes, etc.)
- [ ] Configuración NgRx Store
- [ ] Tests unitarios y E2E
- [ ] Documentación de componentes

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Cronos Bakery System** - Gestión profesional para panaderías modernas
