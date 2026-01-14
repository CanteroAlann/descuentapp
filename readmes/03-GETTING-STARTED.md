# 🚀 Guía de Inicio Rápido - Frontend

## 📋 Requisitos Previos

- Node.js >= 18.x
- pnpm >= 8.x
- Expo CLI (`npx expo`)
- Dispositivo físico o emulador (Android/iOS)

---

## 🛠️ Instalación

```bash
# Clonar el repositorio (si no lo tienes)
git clone <repo-url>
cd descuent-app

# Navegar al frontend
cd frontend

# Instalar dependencias
pnpm install
```

---

## 🔧 Configuración de Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env`:

```env
# URL del backend (ajustar según tu entorno)
EXPO_PUBLIC_API_URL=http://localhost:3000

# Para dispositivo físico en la misma red:
# EXPO_PUBLIC_API_URL=http://192.168.1.X:3000
```

**Nota:** En Expo, las variables de entorno deben tener el prefijo `EXPO_PUBLIC_` para estar disponibles en el cliente.

---

## ▶️ Comandos de Ejecución

### Desarrollo

```bash
# Iniciar servidor de desarrollo Expo
pnpm start

# O con túnel (para dispositivos fuera de la red local)
npx expo start --tunnel

# Iniciar directamente en Android
pnpm android

# Iniciar directamente en iOS
pnpm ios

# Iniciar en navegador web
pnpm web
```

### Testing

```bash
# Ejecutar todos los tests
pnpm test

# Modo watch (re-ejecuta al guardar cambios)
pnpm test:watch

# Con reporte de cobertura
pnpm test:coverage
```

### Validación de Código

```bash
# Verificar tipos TypeScript
pnpm type-check

# Ejecutar linter
pnpm lint
```

---

## 📱 Probar en Dispositivo

### Opción 1: Expo Go (más rápido)

1. Instalar Expo Go desde Play Store / App Store
2. Ejecutar `pnpm start`
3. Escanear QR con la app Expo Go

### Opción 2: Emulador Android

1. Instalar Android Studio con SDK
2. Crear un AVD (Android Virtual Device)
3. Ejecutar `pnpm android`

### Opción 3: Simulador iOS (solo macOS)

1. Instalar Xcode
2. Ejecutar `pnpm ios`

---

## 🌐 Conexión con Backend

El frontend está configurado para conectar con el backend en `localhost:3000`.

### Levantar Backend

```bash
# Desde la raíz del proyecto
cd backend

# Levantar con Docker
docker compose up -d

# O sin Docker
pnpm dev
```

### Endpoints Requeridos

El frontend espera estos endpoints (algunos por implementar en backend):

| Método | Endpoint            | Estado             |
| ------ | ------------------- | ------------------ |
| POST   | `/auth/login`       | ✅ Implementado    |
| POST   | `/users`            | ✅ Implementado    |
| GET    | `/users/:id`        | ✅ Implementado    |
| GET    | `/discounts`        | ⚠️ Por implementar |
| GET    | `/discounts/:id`    | ⚠️ Por implementar |
| GET    | `/discounts/nearby` | ⚠️ Por implementar |

---

## 📂 Estructura del Proyecto

```
frontend/
├── App.tsx                    # Entry point
├── package.json
├── tsconfig.json
├── tailwind.config.js         # Config de NativeWind
├── jest.config.js             # Config de Jest
├── babel.config.js
├── readmes/                   # Documentación
│   ├── 01-ARCHITECTURE.md
│   ├── 02-TESTING.md
│   └── 03-GETTING-STARTED.md
└── src/
    ├── features/              # Features verticales
    │   └── discounts/
    │       ├── domain/
    │       ├── data/
    │       ├── presentation/
    │       └── tests/
    ├── shared/                # Código compartido
    │   └── components/
    └── infrastructure/        # Config global
        ├── api/
        └── query/
```

---

## 🔄 Flujo de Desarrollo

### Crear Nueva Feature

```bash
# 1. Crear estructura de carpetas
mkdir -p src/features/nueva-feature/{domain,data,presentation,tests}

# 2. Crear archivos base
touch src/features/nueva-feature/domain/interfaces/feature.interface.ts
touch src/features/nueva-feature/data/schemas/feature.schema.ts
touch src/features/nueva-feature/data/repositories/feature.repository.ts
touch src/features/nueva-feature/data/mappers/feature.mapper.ts
touch src/features/nueva-feature/presentation/hooks/use-feature.ts
touch src/features/nueva-feature/presentation/components/FeatureComponent.tsx
touch src/features/nueva-feature/tests/feature.repository.test.ts

# 3. Crear index.ts de cada capa
touch src/features/nueva-feature/{domain,data,presentation}/index.ts
touch src/features/nueva-feature/index.ts
```

### Ciclo TDD Recomendado

1. **Red:** Escribir test que falla
2. **Green:** Implementar código mínimo para pasar
3. **Refactor:** Mejorar código manteniendo tests verdes

```bash
# Mantener tests corriendo mientras desarrollas
pnpm test:watch
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@infrastructure/...'"

```bash
# Verificar que tsconfig.json tenga los paths configurados
# Reiniciar el servidor de Metro
npx expo start -c  # -c limpia cache
```

### Error: "Network request failed"

- Verificar que el backend esté corriendo
- En Android físico, usar la IP de tu computadora (no localhost)
- Verificar que el firewall permita conexiones al puerto 3000

### Tests fallan con timeout

```bash
# Aumentar timeout en jest.config.js
testTimeout: 30000

# O en un test específico
jest.setTimeout(30000);
```

### Metro bundler lento

```bash
# Limpiar cache
npx expo start -c

# Verificar que node_modules no esté corrupto
rm -rf node_modules
pnpm install
```

---

## 📚 Referencias

- [Expo Documentation](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [NativeWind](https://www.nativewind.dev)
- [TanStack Query](https://tanstack.com/query)
- [Zod](https://zod.dev)
