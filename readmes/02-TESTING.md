# 🧪 Testing en DescuentApp

## 📋 Resumen

Este documento explica la estrategia de testing implementada en el frontend, incluyendo tests unitarios para repositorios y tests de componentes con React Testing Library.

---

## 🛠️ Stack de Testing

| Herramienta                       | Propósito                             |
| --------------------------------- | ------------------------------------- |
| **Jest**                          | Test runner y framework de assertions |
| **jest-expo**                     | Preset de Jest para proyectos Expo    |
| **@testing-library/react-native** | Testing de componentes React Native   |
| **@testing-library/jest-native**  | Matchers adicionales para RN          |

---

## 📂 Estructura de Tests

```
src/features/discounts/tests/
  ├── discount.repository.test.ts    # Tests unitarios del repositorio
  ├── discount.components.test.tsx   # Tests de componentes
  └── fixtures.ts                    # Datos de prueba reutilizables
```

---

## 🚀 Comandos

```bash
# Navegar al frontend
cd frontend

# Ejecutar todos los tests
pnpm test

# Modo watch (re-ejecuta al guardar)
pnpm test:watch

# Con reporte de cobertura
pnpm test:coverage

# Para CI/CD
pnpm test:ci
```

---

## 📝 Tipos de Tests Implementados

### 1. Tests Unitarios de Repositorio

**Archivo:** `discount.repository.test.ts`

Verifica que el repositorio:

- ✅ Llama a los endpoints correctos
- ✅ Aplica filtros como query params
- ✅ Valida respuestas con Zod
- ✅ Mapea DTOs a entidades de dominio
- ✅ Maneja errores 404 retornando `null`
- ✅ Propaga otros errores

```typescript
describe("DiscountRepository", () => {
  it("debería obtener todos los descuentos correctamente", async () => {
    mockHttpClient.get.mockResolvedValueOnce({ data: mockDiscountsResponse });

    const result = await repository.getAll();

    expect(mockHttpClient.get).toHaveBeenCalledWith("/discounts");
    expect(result).toHaveLength(2);
  });
});
```

### 2. Tests de Validación Zod

**Archivo:** `discount.repository.test.ts` (segunda parte)

Verifica que los schemas de Zod:

- ✅ Aceptan DTOs válidos
- ✅ Rechazan UUIDs inválidos
- ✅ Rechazan porcentajes fuera de rango (0-100)
- ✅ Rechazan títulos vacíos
- ✅ Aceptan coordenadas null

```typescript
describe("DiscountDTO Validation (Zod)", () => {
  it("debería rechazar porcentaje fuera de rango", () => {
    const invalidDTO = { ...validDTO, discountPercentage: 150 };
    expect(() => DiscountDTOSchema.parse(invalidDTO)).toThrow();
  });
});
```

### 3. Tests de Componentes

**Archivo:** `discount.components.test.tsx`

#### DiscountCard

- ✅ Renderiza información correctamente (título, %, tienda)
- ✅ Llama `onPress` al presionar
- ✅ Muestra badge "Activo" para descuentos activos
- ✅ Muestra badge "Expirado" para descuentos vencidos
- ✅ Muestra badge "¡Por vencer!" para próximos a expirar

#### DiscountList

- ✅ Muestra estado de carga inicialmente
- ✅ Muestra lista después de cargar
- ✅ Muestra estado vacío cuando no hay datos
- ✅ Muestra estado de error y botón retry
- ✅ Reintenta al presionar retry
- ✅ Llama `onDiscountPress` al presionar item

```typescript
describe("DiscountList", () => {
  it("debería mostrar estado de carga inicialmente", async () => {
    mockHttpClient.get.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
    );

    render(<DiscountList testID="test-list" />, { wrapper: createWrapper() });

    expect(screen.getByTestId("test-list-loading")).toBeTruthy();
  });
});
```

---

## 🎯 Patrones de Testing Utilizados

### 1. Mocking de Axios

```typescript
jest.mock("../../../../infrastructure/api/http-client", () => ({
  httpClient: {
    get: jest.fn(),
    // ...
  },
}));
```

### 2. Wrapper con QueryClient

```typescript
const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

render(<Component />, { wrapper: createWrapper() });
```

### 3. TestIDs para Queries

```tsx
<View testID="discount-list-loading">
  <ActivityIndicator />
</View>;

// En test:
expect(screen.getByTestId("discount-list-loading")).toBeTruthy();
```

### 4. Fixtures Reutilizables

```typescript
// fixtures.ts
export const mockDiscount: Discount = {
  id: "550e8400-...",
  title: "50% en Pizza",
  // ...
};

export const createMockDiscount = (overrides = {}) => ({
  ...mockDiscount,
  ...overrides,
});
```

---

## 📊 Cobertura de Código

El proyecto está configurado para requerir **70%** de cobertura mínima:

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

Para ver el reporte:

```bash
pnpm test:coverage
# Abre coverage/lcov-report/index.html en tu navegador
```

---

## 🐛 Debugging de Tests

### Ver salida del componente

```typescript
import { render, screen } from "@testing-library/react-native";

render(<MyComponent />);
screen.debug(); // Imprime el árbol de componentes
```

### Esperar cambios asíncronos

```typescript
import { waitFor } from "@testing-library/react-native";

await waitFor(() => {
  expect(screen.getByText("Loaded!")).toBeTruthy();
});
```

### Simular acciones de usuario

```typescript
import { fireEvent } from "@testing-library/react-native";

fireEvent.press(screen.getByTestId("submit-button"));
fireEvent.changeText(screen.getByTestId("email-input"), "test@test.com");
```

---

## ✅ Checklist para Nuevos Tests

Cuando agregues una nueva feature, asegúrate de:

- [ ] Crear `tests/` dentro de la carpeta de la feature
- [ ] Tests unitarios para el repositorio (mocking axios)
- [ ] Tests de validación para schemas Zod
- [ ] Tests de componentes para estados: loading, error, empty, success
- [ ] Tests de interacción (onPress, onSubmit, etc.)
- [ ] Fixtures reutilizables en `fixtures.ts`
- [ ] TestIDs descriptivos en componentes

---

## 📚 Referencias

- [Testing Library Cheatsheet](https://testing-library.com/docs/react-native-testing-library/cheatsheet)
- [Jest Expect API](https://jestjs.io/docs/expect)
- [Testing React Query](https://tanstack.com/query/latest/docs/react/guides/testing)
