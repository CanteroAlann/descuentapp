# 🔌 Guía de Conexión Backend ↔ Frontend

## 📋 Resumen

Este documento detalla cómo el frontend consume la API del backend, incluyendo la configuración necesaria y los patrones utilizados.

---

## 🏗️ Arquitectura de Conexión

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  Component  │───▶│  useDiscounts │───▶│ DiscountRepository│  │
│  │  (UI)       │    │  (Hook)       │    │ (Data Layer)      │  │
│  └─────────────┘    └──────────────┘    └────────┬───────────┘  │
│                                                   │              │
│                      ┌────────────────────────────▼───────────┐ │
│                      │            HTTP Client (Axios)         │ │
│                      │  - Interceptors (auth, errors)         │ │
│                      │  - Base URL config                     │ │
│                      └────────────────────────────┬───────────┘ │
└──────────────────────────────────────────────────┼──────────────┘
                                                    │
                                        ────────────▼────────────
                                        │     NETWORK         │
                                        ──────────────────────
                                                    │
┌──────────────────────────────────────────────────┼──────────────┐
│                          BACKEND                  │              │
│                      ┌────────────────────────────▼───────────┐ │
│                      │           Express Router              │ │
│                      │  /discounts, /auth/login, /users      │ │
│                      └────────────────────────────┬───────────┘ │
│                                                   │              │
│  ┌─────────────┐    ┌──────────────┐    ┌────────▼───────────┐  │
│  │  Controller │◀───│   Use Case   │◀───│    Repository      │  │
│  │             │    │              │    │   (Prisma)         │  │
│  └─────────────┘    └──────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuración del Cliente HTTP

### Archivo: `src/infrastructure/api/config.ts`

```typescript
// URL base desde variable de entorno
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// Configuración de Axios
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Endpoints organizados
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/users",
  },
  DISCOUNTS: {
    BASE: "/discounts",
    BY_ID: (id: string) => `/discounts/${id}`,
    NEARBY: "/discounts/nearby",
  },
};
```

### Archivo: `src/infrastructure/api/http-client.ts`

```typescript
// Cliente Axios con interceptores
const client = axios.create(apiConfig);

// Request: Agregar token de auth
client.interceptors.request.use(async (config) => {
  const token = await getAuthToken(); // desde Zustand o SecureStore
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Manejo centralizado de errores
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Transformar a ApiError personalizado
    throw new ApiError(message, statusCode, error);
  }
);
```

---

## 🔐 Autenticación

### Flujo de Login

```
Frontend                              Backend
   │                                     │
   │  POST /auth/login                   │
   │  { email, password }                │
   │────────────────────────────────────▶│
   │                                     │
   │  200 OK                             │
   │  { token: "jwt...", user: {...} }   │
   │◀────────────────────────────────────│
   │                                     │
   │  [Guardar token en Zustand]         │
   │  [Persistir en SecureStore]         │
```

### Backend Reference: `auth.route.ts`

```typescript
// El backend expone:
router.post('/auth/login', controller.authUser);

// Respuesta esperada:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "User Name"
  }
}
```

### Frontend Implementation (futuro)

```typescript
// src/features/auth/data/repositories/auth.repository.ts
export const createAuthRepository = (httpClient: AxiosInstance) => ({
  async login(email: string, password: string): Promise<AuthResult> {
    const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return AuthResultSchema.parse(response.data);
  },
});
```

---

## 📦 Endpoints de Descuentos

### Endpoints Implementados en Backend

Actualmente el backend **NO tiene** implementados los endpoints de descuentos.
Debes crearlos siguiendo el patrón de users/auth.

### Estructura Esperada

| Método | Endpoint            | Query Params                         | Respuesta    |
| ------ | ------------------- | ------------------------------------ | ------------ |
| GET    | `/discounts`        | `onlyActive`, `minDiscount`, `store` | `Discount[]` |
| GET    | `/discounts/:id`    | -                                    | `Discount`   |
| GET    | `/discounts/nearby` | `lat`, `lng`, `radius`               | `Discount[]` |
| POST   | `/discounts`        | -                                    | `Discount`   |

### Formato de Respuesta Esperado

```json
// GET /discounts
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "50% en Pizza",
    "description": "Descuento en todas las pizzas",
    "discountPercentage": 50,
    "storeName": "Pizza Palace",
    "validUntil": "2025-12-31T23:59:59.000Z",
    "isActive": true,
    "latitude": -34.6037,
    "longitude": -58.3816
  }
]
```

### Cómo Crear el Endpoint en Backend

```typescript
// backend/src/interface-adapters/routes/discount.route.ts
import { Router } from "express";
import { discountController } from "../controllers/DiscountController";

export const discountRoute = (): Router => {
  const router = Router();

  router.get("/discounts", controller.getAll);
  router.get("/discounts/:id", controller.getById);
  router.get("/discounts/nearby", controller.getNearby);
  router.post("/discounts", controller.create);

  return router;
};
```

---

## 🔄 Validación con Zod

El frontend valida TODAS las respuestas de la API con Zod antes de usarlas:

```typescript
// src/features/discounts/data/schemas/discount.schema.ts
export const DiscountDTOSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  discountPercentage: z.number().min(0).max(100),
  storeName: z.string().min(1),
  validUntil: z.string().datetime(),
  isActive: z.boolean(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

// En el repositorio:
const response = await httpClient.get("/discounts");
const validatedData = DiscountsArraySchema.parse(response.data);
// Si la validación falla, se lanza ZodError
```

**Beneficio:** Si el backend cambia el formato de respuesta sin avisar, el frontend detectará el error inmediatamente en lugar de fallar silenciosamente.

---

## 🌐 Configuración de Red

### Desarrollo Local

```env
# .env (frontend)
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Dispositivo Físico (misma red)

```env
# Usar la IP local de tu computadora
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

### Producción

```env
EXPO_PUBLIC_API_URL=https://api.descuentapp.com
```

### Docker (backend)

```yaml
# docker-compose.yml
services:
  backend:
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=...
```

---

## 🔧 Troubleshooting

### "Network request failed"

1. **Verificar backend corriendo:**

   ```bash
   curl http://localhost:3000/health
   ```

2. **Android Emulator:** Usar `10.0.2.2` en lugar de `localhost`

   ```env
   EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
   ```

3. **iOS Simulator:** `localhost` funciona

4. **Dispositivo físico:** Usar IP de la computadora

### "CORS error"

El backend ya tiene CORS configurado:

```typescript
// backend/src/index.ts
app.use(cors());
```

### "401 Unauthorized"

- Verificar que el token se está enviando en el header
- Verificar que el token no expiró
- Verificar que el backend valida el token correctamente

---

## 📚 Referencias

- [Axios Documentation](https://axios-http.com)
- [Zod Documentation](https://zod.dev)
- [React Query + Axios](https://tanstack.com/query/latest/docs/react/examples/react/optimistic-updates-typescript)
