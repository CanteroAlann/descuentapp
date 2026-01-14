# 📱 DescuentApp Frontend - Arquitectura Feature-Based

## 📋 Resumen Ejecutivo

Este documento describe la migración de la arquitectura del frontend de DescuentApp desde una estructura horizontal (capas) hacia una **Feature-Based Architecture** (Vertical Slices), siguiendo principios de **DDD Pragmático** adaptado para aplicaciones móviles React Native.

---

## 🏗️ Estructura de Carpetas

### Antes (Horizontal/Capas)

```
src/
  core/
    domain/
    usecases/
  infrastructure/
    api/
    repositories/
  presentation/
    components/
    navigation/
    screens/
```

### Después (Feature-Based/Vertical Slices)

```
src/
  features/
    discounts/           # Feature de descuentos
      domain/            # Interfaces puras de TypeScript
        interfaces/
          discount.interface.ts
        index.ts
      data/              # Repositorios y validación
        schemas/
          discount.schema.ts    # Zod schemas
        mappers/
          discount.mapper.ts    # DTO -> Domain
        repositories/
          discount.repository.ts
        index.ts
      presentation/      # UI Components y Hooks
        hooks/
          use-discounts.ts      # TanStack Query hooks
        components/
          DiscountCard.tsx
          DiscountList.tsx
        screens/
          DiscountsScreen.tsx
        index.ts
      tests/             # Tests de la feature
        discount.repository.test.ts
        discount.components.test.tsx
        fixtures.ts
      index.ts           # Public API de la feature

    auth/                # (Futura feature)
    profile/             # (Futura feature)

  shared/               # Código compartido entre features
    components/
      ui.tsx            # UI Kit: Button, Badge, EmptyState, etc.
    hooks/              # Hooks globales (useNetworkStatus, etc.)
    utils/              # Utilidades comunes

  infrastructure/       # Configuración global
    api/
      config.ts         # URLs, endpoints, constantes
      http-client.ts    # Cliente Axios configurado
      index.ts
    query/
      query-client.ts   # TanStack Query config
      index.ts
    storage/            # AsyncStorage, SecureStore
    theme/              # Theme provider, colores
```

---

## 🎯 Decisiones Arquitectónicas

### 1. **Feature-Based Architecture (Vertical Slices)**

**Razón:** Cada feature es autocontenida y puede ser desarrollada, testeada y desplegada de forma independiente.

**Beneficios:**

- ✅ Mejor escalabilidad del equipo (ownership por feature)
- ✅ Menor acoplamiento entre módulos
- ✅ Más fácil de entender (todo lo de "descuentos" está junto)
- ✅ Facilita eliminación de features obsoletas

### 2. **DDD Pragmático para UI**

**Razón:** En frontend, el "dominio" es más ligero que en backend. No necesitamos Entities con comportamiento, solo **interfaces puras** que representan los datos que la UI necesita.

```typescript
// ❌ Evitamos esto (over-engineering en frontend)
class Discount {
  private _id: string;
  validate(): void { ... }
  applyDiscount(price: number): number { ... }
}

// ✅ Preferimos esto (interfaces puras)
interface Discount {
  readonly id: string;
  readonly title: string;
  readonly discountPercentage: number;
  // ...
}
```

### 3. **Separación DTO vs Domain**

**Razón:** La API puede cambiar su formato sin afectar los componentes.

```
API Response (DTO) → Zod Validation → Mapper → Domain Entity → Component
```

- **DTOs**: Representan exactamente lo que viene de la API
- **Zod Schemas**: Validan la respuesta en runtime
- **Mappers**: Transforman y limpian datos (ej: string → Date)
- **Domain**: Interfaces limpias que los componentes usan

### 4. **TanStack Query para Server State**

**Razón:** Evita duplicar lógica de loading, error, cache, refetch en cada componente.

```typescript
// ❌ Sin TanStack Query
const [discounts, setDiscounts] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchDiscounts()
    .then(setDiscounts)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);

// ✅ Con TanStack Query
const { data, isLoading, error, refetch } = useDiscounts();
```

### 5. **Zustand para Client State (futuro)**

**Razón:** Estado global que NO viene del servidor (sesión, preferencias, carrito).

```typescript
// Ejemplo futuro para auth
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
```

### 6. **NativeWind para Estilos**

**Razón:** Utility-first CSS con la sintaxis familiar de Tailwind.

```tsx
// Clases utilitarias directamente en JSX
<View className="flex-1 bg-gray-50 p-4">
  <Text className="text-xl font-bold text-primary-500">Título</Text>
</View>
```

---

## 📁 Archivos Creados

| Archivo                                                       | Propósito                        |
| ------------------------------------------------------------- | -------------------------------- |
| `features/discounts/domain/interfaces/discount.interface.ts`  | Interfaces puras del dominio     |
| `features/discounts/data/schemas/discount.schema.ts`          | Validación Zod de la API         |
| `features/discounts/data/mappers/discount.mapper.ts`          | Transformación DTO → Domain      |
| `features/discounts/data/repositories/discount.repository.ts` | Consumo de API                   |
| `features/discounts/presentation/hooks/use-discounts.ts`      | Custom hooks con React Query     |
| `features/discounts/presentation/components/DiscountCard.tsx` | Tarjeta de descuento             |
| `features/discounts/presentation/components/DiscountList.tsx` | Lista con estados                |
| `features/discounts/presentation/screens/DiscountsScreen.tsx` | Pantalla completa                |
| `features/discounts/tests/*.test.ts`                          | Tests unitarios y de componentes |
| `shared/components/ui.tsx`                                    | UI Kit reutilizable              |
| `infrastructure/api/http-client.ts`                           | Cliente Axios configurado        |
| `infrastructure/query/query-client.ts`                        | Configuración de React Query     |

---

## 🔗 Conexión Backend ↔ Frontend

El frontend está preparado para conectarse con estos endpoints del backend:

| Método | Endpoint                                 | Descripción                 |
| ------ | ---------------------------------------- | --------------------------- |
| GET    | `/discounts`                             | Lista todos los descuentos  |
| GET    | `/discounts/:id`                         | Obtiene un descuento por ID |
| GET    | `/discounts/nearby?lat=X&lng=Y&radius=Z` | Descuentos cercanos         |

**Nota:** El backend actualmente no tiene implementados estos endpoints de discounts. Deberás crearlos siguiendo el patrón existente de `user.route.ts` y `auth.route.ts`.

---

## 🚀 Próximos Pasos

1. **Implementar endpoints en backend** para descuentos
2. **Agregar feature de Auth** siguiendo el mismo patrón
3. **Configurar navegación** con React Navigation
4. **Implementar Zustand** para estado de sesión
5. **Agregar feature de perfil** de usuario

---

## 📚 Referencias

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://zod.dev)
- [NativeWind](https://www.nativewind.dev)
- [Feature-Sliced Design](https://feature-sliced.design)
