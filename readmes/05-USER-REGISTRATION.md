# 05 - Registro de Usuarios: Frontend ↔ Backend

> **Última actualización:** Enero 14, 2026  
> **Propósito:** Documentar la implementación del sistema de registro de usuarios desde el frontend hacia el backend.

---

## 📋 Tabla de Contenidos

1. [Resumen General](#resumen-general)
2. [Arquitectura de la Solución](#arquitectura-de-la-solución)
3. [Componentes Implementados](#componentes-implementados)
4. [Flujo de Datos](#flujo-de-datos)
5. [Guía de Uso](#guía-de-uso)
6. [Validaciones y Manejo de Errores](#validaciones-y-manejo-de-errores)
7. [Testing](#testing)

---

## 🎯 Resumen General

Se implementó un sistema completo de registro de usuarios que permite crear nuevas cuentas desde el frontend de React Native, conectándose al backend Express/Prisma siguiendo la arquitectura limpia del proyecto.

### ✨ Características principales:

- ✅ Formulario de registro con validación en tiempo real
- ✅ Integración con React Query para gestión de estado asíncrono
- ✅ Validación de campos (email, nombre, contraseña)
- ✅ Feedback visual durante el proceso de creación
- ✅ Manejo de errores con mensajes informativos
- ✅ Diseño responsive y accesible

---

## 🏗 Arquitectura de la Solución

La implementación sigue la **Arquitectura Limpia** en capas:

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTATION                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ RegisterForm │  │RegisterScreen│  │ use-users │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                      DOMAIN                          │
│  ┌──────────────────┐  ┌──────────────────────────┐│
│  │  User Interface  │  │ CreateUserInput Interface││
│  │  IUserRepository │  │                          ││
│  └──────────────────┘  └──────────────────────────┘│
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                       DATA                           │
│  ┌──────────────────────────────────────────────┐  │
│  │         UserRepository (HTTP Client)         │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                      │
│  ┌──────────────────────────────────────────────┐  │
│  │    httpClient (Axios)  →  Backend API        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   BACKEND API                        │
│  POST /users  →  UserController.createUser()        │
│  ↓                                                   │
│  CreateUser Use Case                                 │
│  ↓                                                   │
│  UserRepository (Prisma)                             │
│  ↓                                                   │
│  PostgreSQL Database                                 │
└─────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes Implementados

### 1. **Domain Layer** - Interfaces y Tipos

**Archivo:** `frontend/src/features/users/domain/interfaces/users.interface.ts`

```typescript
export interface User {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly password?: string; // Opcional (no se devuelve desde el backend)
}

export interface CreateUserInput {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
}

export interface IUserRepository {
  getByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  create(user: CreateUserInput): Promise<User>;
}
```

**Propósito:**

- Define las entidades del dominio (User)
- Define el contrato de entrada (CreateUserInput)
- Define la interfaz del repositorio (IUserRepository)

---

### 2. **Data Layer** - Repositorio

**Archivo:** `frontend/src/features/users/data/repositories/user.repository.ts`

```typescript
export const createUserRepository = (
  httpClient: AxiosInstance
): IUserRepository => {
  return {
    async create(userInput: CreateUserInput): Promise<User> {
      const response = await httpClient.post("/users", userInput);
      return response.data.data; // Extrae el usuario del wrapper { success, data }
    },
    // ... otros métodos
  };
};
```

**Propósito:**

- Implementa la interfaz IUserRepository
- Se comunica con el backend vía HTTP (Axios)
- Maneja la deserialización de la respuesta del backend

**Endpoint Backend:**

```
POST /users
Body: { fullName, email, password }
Response: { success: true, data: { id, fullName, email } }
```

---

### 3. **Presentation Layer - Hook**

**Archivo:** `frontend/src/features/users/presentation/hooks/use-users.ts`

```typescript
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserInput>({
    mutationFn: (userInput: CreateUserInput) =>
      userRepository.create(userInput),
    onSuccess: (newUser) => {
      // Invalida queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      // Actualiza cache del usuario específico
      queryClient.setQueryData(userQueryKeys.detail(newUser.email), newUser);
    },
  });
};
```

**Propósito:**

- Encapsula la lógica de React Query
- Proporciona estados de loading, error y success
- Gestiona invalidación de cache automáticamente
- Proporciona una API simple para los componentes

**Estados disponibles:**

- `isPending`: Indica si la mutación está en proceso
- `isError`: Indica si hubo un error
- `error`: El objeto de error si lo hay
- `data`: El usuario creado
- `mutate()`: Función para ejecutar la mutación
- `mutateAsync()`: Versión promise de mutate

---

### 4. **Presentation Layer - Componente RegisterForm**

**Archivo:** `frontend/src/features/users/presentation/components/RegisterForm.tsx`

**Funcionalidades principales:**

#### a) **Estado del Formulario**

```typescript
const [formData, setFormData] = useState<CreateUserInput>({
  fullName: "",
  email: "",
  password: "",
});
const [errors, setErrors] = useState<Partial<CreateUserInput>>({});
```

#### b) **Validación de Campos**

```typescript
const validateForm = (): boolean => {
  const newErrors: Partial<CreateUserInput> = {};

  // Validar nombre (mínimo 3 caracteres)
  if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
    newErrors.fullName = "El nombre debe tener al menos 3 caracteres";
  }

  // Validar email (regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim() || !emailRegex.test(formData.email)) {
    newErrors.email = "Email inválido";
  }

  // Validar password (mínimo 6 caracteres)
  if (!formData.password || formData.password.length < 6) {
    newErrors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### c) **Manejo de Envío**

```typescript
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const user = await createUser.mutateAsync(formData);
    Alert.alert("Éxito", `Usuario ${user.fullName} creado correctamente`);
    onSuccess?.(user.email);
    // Limpiar formulario
    setFormData({ fullName: "", email: "", password: "" });
  } catch (error: any) {
    Alert.alert("Error", error.message || "Error al crear el usuario");
  }
};
```

#### d) **Renderizado de Campos**

Cada campo de entrada incluye:

- Label descriptivo
- TextInput con validación visual (borde rojo si hay error)
- Mensaje de error debajo del input
- Props apropiadas (keyboardType, autoCapitalize, secureTextEntry)
- Deshabilitado durante el envío

**Ejemplo:**

```tsx
<View className="mb-4">
  <Text className="text-gray-700 font-medium mb-2">Email</Text>
  <TextInput
    className={`border rounded-xl px-4 py-3 ${
      errors.email ? "border-red-500" : "border-gray-300"
    }`}
    placeholder="ejemplo@email.com"
    value={formData.email}
    onChangeText={(text) => {
      setFormData({ ...formData, email: text });
      if (errors.email) setErrors({ ...errors, email: undefined });
    }}
    keyboardType="email-address"
    autoCapitalize="none"
    editable={!createUser.isPending}
  />
  {errors.email && (
    <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
  )}
</View>
```

---

### 5. **Presentation Layer - Screen**

**Archivo:** `frontend/src/features/users/presentation/screens/RegisterScreen.tsx`

**Propósito:**

- Envuelve el RegisterForm en una pantalla completa
- Proporciona SafeAreaView para notch/status bar
- Maneja el teclado con KeyboardAvoidingView
- Permite scroll cuando el teclado está abierto
- Delega callbacks a componentes superiores (navegación)

**Estructura:**

```tsx
<SafeAreaView className="flex-1 bg-white">
  <KeyboardAvoidingView behavior="padding">
    <ScrollView>
      <RegisterHeader />
      <RegisterForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>
```

---

## 🔄 Flujo de Datos Completo

### **Escenario: Usuario completa el formulario**

```
1. Usuario ingresa datos en RegisterForm
   ↓
2. Usuario presiona "Crear Usuario"
   ↓
3. RegisterForm valida los campos localmente
   ↓
4. Si es válido → llama a createUser.mutateAsync(formData)
   ↓
5. useCreateUser ejecuta userRepository.create(userInput)
   ↓
6. UserRepository hace POST /users vía httpClient (Axios)
   ↓
7. Backend recibe la request en UserController.createUser()
   ↓
8. Backend ejecuta CreateUser use case
   ↓
9. Use case valida email, hashea password, guarda en DB
   ↓
10. Backend responde: { success: true, data: { id, fullName, email } }
   ↓
11. UserRepository extrae data.data y lo devuelve
   ↓
12. useCreateUser recibe el usuario creado
   ↓
13. onSuccess invalida queries y actualiza cache
   ↓
14. RegisterForm muestra Alert de éxito
   ↓
15. Ejecuta callback onSuccess(email) → navega/cierra
```

---

## 📖 Guía de Uso

### **Integrar en tu App**

#### 1. **Importar los componentes**

```tsx
import { RegisterScreen, RegisterForm } from "@features/users";
```

#### 2. **Opción A: Usar la pantalla completa (recomendado)**

```tsx
// En tu navigator (React Navigation)
<Stack.Screen
  name="Register"
  component={RegisterScreen}
  options={{
    headerShown: false,
    title: "Registro",
  }}
/>
```

**Con callbacks:**

```tsx
<RegisterScreen
  onSuccess={(email) => {
    // Navegar al login con el email pre-llenado
    navigation.navigate("Login", { email });
  }}
  onCancel={() => {
    navigation.goBack();
  }}
/>
```

#### 3. **Opción B: Usar solo el formulario**

```tsx
import { RegisterForm } from "@features/users";

export const MyCustomScreen = () => {
  return (
    <View className="flex-1 p-6">
      <Text className="text-2xl font-bold mb-4">¡Únete!</Text>
      <RegisterForm onSuccess={(email) => console.log("Registrado:", email)} />
    </View>
  );
};
```

---

## ⚠️ Validaciones y Manejo de Errores

### **Validaciones Frontend**

| Campo      | Reglas                         | Mensaje de Error                                 |
| ---------- | ------------------------------ | ------------------------------------------------ |
| Nombre     | Requerido, mínimo 3 caracteres | "El nombre debe tener al menos 3 caracteres"     |
| Email      | Requerido, formato válido      | "Email inválido"                                 |
| Contraseña | Requerido, mínimo 6 caracteres | "La contraseña debe tener al menos 6 caracteres" |

### **Validaciones Backend**

El backend (`CreateUser.ts`) realiza validaciones adicionales:

- Email único (no puede estar duplicado)
- Formato de email válido (usando value object Email)
- Password hasheado con bcrypt antes de guardar

### **Manejo de Errores**

#### **Errores de Red**

```typescript
// httpClient intercepta errores y los transforma
catch (error: any) {
  if (error.response?.status === 400) {
    // Error de validación del backend
    Alert.alert('Error', 'Datos inválidos');
  } else if (error.response?.status === 500) {
    // Error del servidor
    Alert.alert('Error', 'Error del servidor, intenta más tarde');
  } else {
    // Error de red
    Alert.alert('Error', 'Sin conexión a internet');
  }
}
```

#### **Errores del Backend**

Si el email ya existe:

```json
{
  "success": false,
  "message": "Failed to create user"
}
```

El frontend mostrará: **"Error al crear el usuario"**

---

## 🧪 Testing

### **Cómo testear manualmente**

1. **Iniciar el backend:**

```bash
cd backend
pnpm install
pnpm dev
```

2. **Iniciar el frontend:**

```bash
cd frontend
pnpm install
pnpm start
```

3. **Navegar a RegisterScreen**

4. **Probar casos:**

| Caso            | Acción                        | Resultado Esperado                                       |
| --------------- | ----------------------------- | -------------------------------------------------------- |
| Campos vacíos   | Submit sin llenar             | Muestra errores en todos los campos                      |
| Email inválido  | Ingresar "test"               | Muestra "Email inválido"                                 |
| Password corta  | Ingresar "123"                | Muestra "La contraseña debe tener al menos 6 caracteres" |
| Datos válidos   | Llenar correctamente y enviar | Muestra "Usuario creado correctamente"                   |
| Email duplicado | Usar email existente          | Muestra "Error al crear el usuario"                      |

### **Testing Automatizado**

**Ejemplo de test (Jest + React Native Testing Library):**

```tsx
// frontend/src/features/users/tests/register-form.test.tsx
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { RegisterForm } from "../presentation/components/RegisterForm";

describe("RegisterForm", () => {
  it("should show validation errors for empty fields", () => {
    const { getByTestId, getByText } = render(<RegisterForm />);

    const submitButton = getByTestId("register-form-submit-button");
    fireEvent.press(submitButton);

    expect(getByText("El nombre es requerido")).toBeTruthy();
    expect(getByText("El email es requerido")).toBeTruthy();
    expect(getByText("La contraseña es requerida")).toBeTruthy();
  });

  it("should create user with valid data", async () => {
    const onSuccess = jest.fn();
    const { getByTestId } = render(<RegisterForm onSuccess={onSuccess} />);

    fireEvent.changeText(
      getByTestId("register-form-fullname-input"),
      "Juan Pérez"
    );
    fireEvent.changeText(
      getByTestId("register-form-email-input"),
      "juan@test.com"
    );
    fireEvent.changeText(getByTestId("register-form-password-input"), "123456");

    fireEvent.press(getByTestId("register-form-submit-button"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("juan@test.com");
    });
  });
});
```

---

## 📦 Archivos Creados/Modificados

### **Archivos Nuevos:**

```
frontend/src/features/users/
├── presentation/
│   ├── hooks/
│   │   └── use-users.ts                    [NUEVO]
│   ├── components/
│   │   └── RegisterForm.tsx                [NUEVO]
│   └── screens/
│       └── RegisterScreen.tsx              [NUEVO]
```

### **Archivos Modificados:**

```
frontend/src/features/users/
├── domain/
│   └── interfaces/
│       └── users.interface.ts              [MODIFICADO] - Agregado CreateUserInput
├── data/
│   ├── index.ts                            [MODIFICADO] - Corregido nombre de módulo
│   └── repositories/
│       └── user.repository.ts              [MODIFICADO] - Implementado create()
├── presentation/
│   └── index.ts                            [MODIFICADO] - Exportaciones actualizadas
└── index.ts                                [MODIFICADO] - Exportaciones actualizadas
```

---

## 🎓 Conceptos Clave Aplicados

### **1. Clean Architecture**

- Separación clara entre capas
- Dependencias apuntan hacia adentro (domain no conoce infraestructura)
- Interfaces definen contratos entre capas

### **2. React Query / TanStack Query**

- Gestión de estado servidor centralizada
- Cache automático
- Invalidación de queries
- Estados de loading/error manejados automáticamente

### **3. Repository Pattern**

- Abstracción de la fuente de datos
- Fácil de mockear para testing
- Permite cambiar implementación sin afectar lógica de negocio

### **4. Compound Components**

- RegisterForm es independiente y reutilizable
- RegisterScreen compone el formulario con layout específico
- Permite flexibilidad en el uso

---

## 🚀 Próximos Pasos Sugeridos

1. **Agregar confirmación de contraseña** en el formulario
2. **Implementar validación de fortaleza de contraseña**
3. **Agregar campo de teléfono o fecha de nacimiento**
4. **Implementar login** usando la misma arquitectura
5. **Agregar tests unitarios y de integración**
6. **Implementar verificación de email**
7. **Agregar internacionalización (i18n)**

---

## 📞 Soporte

Para dudas o problemas:

1. Revisar los logs del backend en la terminal
2. Revisar los logs del frontend en la consola de Expo/Metro
3. Verificar que el backend esté corriendo en `http://localhost:3000`
4. Verificar la configuración de `API_BASE_URL` en el frontend

---

**Autor:** GitHub Copilot  
**Fecha:** Enero 14, 2026  
**Versión:** 1.0
