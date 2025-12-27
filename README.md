# 🛍️ DescuentApp - Monorepo

Aplicación de descuentos construida con **Clean Architecture** y **Domain-Driven Design (DDD)**.

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Scripts Disponibles](#scripts-disponibles)
- [Variables de Entorno](#variables-de-entorno)

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture** y **DDD**:

### Backend

- **Domain**: Entidades, Value Objects e Interfaces de Repositorios
- **Application**: Casos de Uso y DTOs
- **Infrastructure**: Implementaciones de repositorios, base de datos y servicios externos
- **Interface Adapters**: Controllers, Routes y Middlewares

### Frontend

- **Core**: Lógica de dominio del cliente y casos de uso
- **Presentation**: Screens, Components y Navigation
- **Infrastructure**: API calls y repositorios

## 🚀 Tecnologías

### Backend

- Node.js 20 (Alpine)
- Express.js
- TypeScript
- PostgreSQL
- Docker & Docker Compose
- Jest (Testing)

### Frontend

- React Native
- Expo (Managed Workflow)
- NativeWind (Tailwind CSS)
- TypeScript

## 📁 Estructura del Proyecto

\`\`\`
descuent-app/
├── backend/
│ ├── src/
│ │ ├── domain/
│ │ │ ├── entities/
│ │ │ ├── value-objects/
│ │ │ └── repositories/
│ │ ├── application/
│ │ │ ├── use-cases/
│ │ │ └── dtos/
│ │ ├── infrastructure/
│ │ │ ├── database/
│ │ │ ├── repositories/
│ │ │ └── external-services/
│ │ ├── interface-adapters/
│ │ │ ├── controllers/
│ │ │ ├── routes/
│ │ │ └── middlewares/
│ │ └── index.ts
│ ├── tests/
│ ├── Dockerfile
│ ├── package.json
│ └── tsconfig.json
├── frontend/
│ ├── src/
│ │ ├── core/
│ │ │ ├── domain/
│ │ │ └── usecases/
│ │ ├── presentation/
│ │ │ ├── screens/
│ │ │ ├── components/
│ │ │ └── navigation/
│ │ └── infrastructure/
│ │ ├── api/
│ │ └── repositories/
│ ├── assets/
│ ├── App.tsx
│ ├── package.json
│ └── tsconfig.json
├── docker-compose.yml
├── .env.example
└── README.md
\`\`\`

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ y pnpm 8+
- Docker y Docker Compose
- Expo CLI (para el frontend)

**Instalar pnpm:**

```bash
npm install -g pnpm
# o usando corepack (recomendado)
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

### 1. Clonar el repositorio

\`\`\`bash
git clone <your-repo-url>
cd descuent-app
\`\`\`

### 2. Configurar variables de entorno

\`\`\`bash

# En la raíz del proyecto

cp .env.example .env

# Backend

cd backend
cp .env.example .env
cd ..

# Frontend

cd frontend
cp .env.example .env
cd ..
\`\`\`

### 3. Backend con Docker

\`\`\`bash

# Construir y levantar los servicios

docker-compose up -d

# Ver logs

docker-compose logs -f backend

# Detener servicios

docker-compose down
\`\`\`

### 4. Frontend (Desarrollo local)

```bash
# Instalar todas las dependencias del monorepo desde la raíz
pnpm install

# Iniciar frontend
pnpm frontend:start

# O directamente en dispositivo/emulador
pnpm frontend:android  # Para Android
pnpm frontend:ios      # Para iOS
```

## 🎯 Uso

### Acceder a los servicios

- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **pgAdmin**: http://localhost:5050
  - Email: admin@descuentapp.com
  - Password: admin123
- **Frontend**: Escanea el QR con Expo Go

### Conectar a PostgreSQL

**Desde pgAdmin:**

1. Accede a http://localhost:5050
2. Add New Server
   - Name: DescuentApp
   - Host: postgres
   - Port: 5432
   - Database: descuentapp
   - Username: postgres
   - Password: postgres123

**Desde tu máquina local:**
\`\`\`bash
psql -h localhost -p 5432 -U postgres -d descuentapp

# Password: postgres123

\`\`\`

## 📜 Scripts Disponibles

### Monorepo (desde la raíz)

```bash
pnpm install:all        # Instalar todas las dependencias
pnpm backend:dev        # Desarrollo backend
pnpm backend:build      # Compilar backend
pnpm backend:test       # Tests backend
pnpm frontend:start     # Iniciar Expo
pnpm frontend:android   # Abrir en Android
pnpm frontend:ios       # Abrir en iOS
```

### Backend (desde /backend)

```bash
pnpm dev             # Desarrollo con nodemon
pnpm build           # Compilar TypeScript
pnpm start           # Producción
pnpm test            # Ejecutar tests
pnpm test:watch      # Tests en modo watch
pnpm test:coverage   # Coverage de tests
```

### Frontend (desde /frontend)

```bash
pnpm start           # Iniciar Expo
pnpm android         # Abrir en Android
pnpm ios             # Abrir en iOS
pnpm web             # Abrir en navegador
pnpm lint            # Linter
pnpm type-check      # Verificar tipos TypeScript
```

### Docker

\`\`\`bash

# Levantar todos los servicios

docker-compose up -d

# Ver logs

docker-compose logs -f

# Reconstruir contenedores

docker-compose up -d --build

# Detener servicios

docker-compose down

# Limpiar todo (incluyendo volúmenes)

docker-compose down -v
\`\`\`

## 🔐 Variables de Entorno

### Backend (.env)

\`\`\`env
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=descuentapp
DB_USER=postgres
DB_PASSWORD=postgres123
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
\`\`\`

### Frontend (.env)

\`\`\`env
API_URL=http://localhost:3000
\`\`\`

## 🧪 Testing

El backend incluye Jest configurado con soporte para TypeScript:

```bash
# Desde la raíz
pnpm backend:test

# O desde /backend
pnpm test                 # Ejecutar todos los tests
pnpm test:watch           # Modo watch
pnpm test:coverage        # Generar reporte de cobertura
```

## 📱 Path Aliases

Ambos proyectos tienen configurados path aliases para imports limpios:

### Backend

\`\`\`typescript
import { User } from '@domain/entities/User';
import { CreateUserUseCase } from '@application/use-cases/CreateUserUseCase';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { UserController } from '@interface-adapters/controllers/UserController';
\`\`\`

### Frontend

\`\`\`typescript
import { UserEntity } from '@core/domain/UserEntity';
import { LoginScreen } from '@presentation/screens/LoginScreen';
import { apiClient } from '@infrastructure/api/config';
\`\`\`

## 🐳 Docker

El proyecto usa multi-stage builds para optimizar el tamaño de las imágenes:

- **Stage 1 (builder)**: Compila TypeScript
- **Stage 2 (production)**: Solo runtime con código compilado
- Usuario no-root para seguridad
- Health checks configurados
- **pnpm** para gestión eficiente de dependencias

## 📦 ¿Por qué pnpm?

- **Eficiencia de espacio**: Almacenamiento centralizado de paquetes (`.pnpm-store`)
- **Instalaciones más rápidas**: Enlazado de paquetes en lugar de copiarlos
- **Monorepo-friendly**: Soporte nativo para workspaces
- **Strict**: Mejor manejo de dependencias peer
- **Ideal para múltiples servicios**: Perfecto cuando agregas más servicios al monorepo

## 📝 Próximos Pasos

1. Implementar entidades del dominio
2. Crear casos de uso
3. Configurar autenticación JWT
4. Implementar repositorios
5. Crear screens del frontend
6. Configurar navegación
7. Implementar tests unitarios e integración

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**Desarrollado con ❤️ siguiendo Clean Architecture y DDD**
