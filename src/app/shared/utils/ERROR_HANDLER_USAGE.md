# Error Handler Utility - Guía de Uso

## Descripción

El `ErrorHandler` es una utilidad robusta para gestionar errores de manera centralizada y consistente en toda la aplicación. Proporciona logging detallado, mensajes amigables para el usuario, y facilita el debugging.

## Características

✅ **Manejo centralizado de errores HTTP**
✅ **Mensajes de error amigables para el usuario**
✅ **Logging estructurado en consola**
✅ **Extracción de errores de validación**
✅ **Detección de errores reintenteables**
✅ **Tipado fuerte con TypeScript**
✅ **Integración con RxJS**

---

## Uso en Servicios (RxJS Observables)

### 1. Importar la utilidad

```typescript
import { handleError } from '../../shared/utils/error-handler.util';
```

### 2. Usar en pipes de RxJS

```typescript
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, credentials).pipe(
    map((response) => response.data),
    catchError(handleError({
      context: 'Login',
      customMessage: 'Error al iniciar sesión'
    }))
  );
}
```

### Opciones disponibles

```typescript
interface ErrorHandlerOptions {
  context?: string;           // Contexto del error (e.g., 'Login', 'Fetch users')
  logToConsole?: boolean;     // Si se debe loguear en consola (default: true)
  notifyUser?: boolean;       // Si se debe notificar al usuario
  customMessage?: string;     // Mensaje personalizado
}
```

---

## Uso en Bloques Try-Catch

### 1. Importar la utilidad

```typescript
import { createErrorCatcher } from '../../shared/utils/error-handler.util';
```

### 2. Crear un error catcher

```typescript
isAuthenticated(): boolean {
  const token = this.storage.getAccessToken();
  if (!token) {
    return false;
  }

  try {
    const payload = this.decodeToken(token);
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (error: unknown) {
    const errorCatcher = createErrorCatcher({ context: 'Token validation' });
    const errorDetails = errorCatcher(error);

    // Opcional: manejar el error
    console.error(errorDetails.message);
    return false;
  }
}
```

---

## Tipos de Error

La utilidad clasifica automáticamente los errores:

```typescript
enum ErrorType {
  NETWORK = 'NETWORK',           // Error de red (status 0)
  HTTP = 'HTTP',                 // Error HTTP genérico
  VALIDATION = 'VALIDATION',     // Error de validación (400, 422)
  AUTHENTICATION = 'AUTHENTICATION', // Error de autenticación (401)
  AUTHORIZATION = 'AUTHORIZATION',   // Error de autorización (403)
  NOT_FOUND = 'NOT_FOUND',      // Recurso no encontrado (404)
  CONFLICT = 'CONFLICT',         // Conflicto (409)
  SERVER = 'SERVER',             // Error del servidor (500, 502, 503, 504)
  UNKNOWN = 'UNKNOWN',           // Error desconocido
}
```

### Obtener el tipo de error

```typescript
import { ErrorHandler, ErrorType } from '../../shared/utils/error-handler.util';

const errorType = ErrorHandler.getErrorType(error);

if (errorType === ErrorType.VALIDATION) {
  // Manejar errores de validación
}
```

---

## Manejo de Errores de Validación

### Extraer errores de validación

```typescript
import { ErrorHandler, ValidationError } from '../../shared/utils/error-handler.util';

const validationErrors: ValidationError[] = ErrorHandler.extractValidationErrors(error);

validationErrors.forEach((err) => {
  console.log(`Field: ${err.field}, Message: ${err.message}`);
});
```

### Estructura de errores de validación

```typescript
interface ValidationError {
  field: string;    // Campo con error (e.g., 'email', 'password')
  message: string;  // Mensaje del error
}
```

---

## Verificar si un Error es Reintenteble

```typescript
import { ErrorHandler } from '../../shared/utils/error-handler.util';

if (ErrorHandler.isRetryable(error)) {
  // Reintentar la operación
  retry(3);
}
```

Errores reintenteables:
- Error de red (status 0)
- Bad Gateway (502)
- Service Unavailable (503)
- Gateway Timeout (504)

---

## ErrorDetails Interface

Todos los métodos devuelven o manejan objetos `ErrorDetails`:

```typescript
interface ErrorDetails {
  message: string;          // Mensaje de error amigable
  status?: number;          // Código de estado HTTP
  statusText?: string;      // Texto del estado HTTP
  originalError?: unknown;  // Error original
  timestamp: string;        // Timestamp ISO del error
  context?: string;         // Contexto donde ocurrió el error
}
```

---

## Mensajes de Error por Código HTTP

La utilidad proporciona mensajes amigables automáticamente:

| Código | Mensaje |
|--------|---------|
| 0      | No se puede conectar al servidor. Verifique su conexión a internet. |
| 400    | Solicitud inválida. Por favor, verifique los datos ingresados. |
| 401    | Su sesión ha expirado. Por favor, inicie sesión nuevamente. |
| 403    | No tiene permisos para realizar esta acción. |
| 404    | Recurso no encontrado. |
| 409    | Ya existe un recurso con esos datos. |
| 422    | Los datos proporcionados no son válidos. |
| 500    | Error interno del servidor. Por favor, intente nuevamente más tarde. |
| 502    | El servidor no está disponible. Por favor, intente nuevamente. |
| 503    | El servicio no está disponible temporalmente. Por favor, intente más tarde. |
| 504    | Tiempo de espera agotado. Por favor, intente nuevamente. |

---

## Ejemplos Completos

### Ejemplo 1: Servicio con manejo de errores

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from '../../shared/utils/error-handler.util';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>('/api/users').pipe(
      map(response => response.data),
      catchError(handleError({
        context: 'Fetching users',
        customMessage: 'Error al obtener usuarios'
      }))
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<ApiResponse<User>>('/api/users', user).pipe(
      map(response => response.data),
      catchError(handleError({
        context: 'Creating user'
      }))
    );
  }
}
```

### Ejemplo 2: Componente con manejo de errores

```typescript
import { Component } from '@angular/core';
import { createErrorCatcher, ErrorHandler, ValidationError } from '../../shared/utils/error-handler.util';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {

  onSubmit(formData: any): void {
    this.userService.createUser(formData).subscribe({
      next: (user) => {
        console.log('User created:', user);
      },
      error: (error) => {
        // Extraer errores de validación si existen
        const validationErrors: ValidationError[] = ErrorHandler.extractValidationErrors(error);

        if (validationErrors.length > 0) {
          validationErrors.forEach(err => {
            this.form.get(err.field)?.setErrors({ server: err.message });
          });
        }
      }
    });
  }

  processLocalData(data: any): void {
    try {
      // Procesar datos
      const result = JSON.parse(data);
      return result;
    } catch (error: unknown) {
      const errorCatcher = createErrorCatcher({ context: 'Processing local data' });
      const errorDetails = errorCatcher(error);

      this.notificationService.error(errorDetails.message);
      return null;
    }
  }
}
```

### Ejemplo 3: Manejo avanzado con retry

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorHandler, handleError } from '../../shared/utils/error-handler.util';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  fetchCriticalData(): Observable<Data> {
    return this.http.get<Data>('/api/critical-data').pipe(
      // Reintentar automáticamente errores reintenteables
      catchError((error) => {
        if (ErrorHandler.isRetryable(error)) {
          return throwError(() => error);
        }
        return handleError({ context: 'Fetch critical data' })(error);
      }),
      retry({
        count: 3,
        delay: (error, retryCount) => {
          if (ErrorHandler.isRetryable(error)) {
            return timer(retryCount * 1000); // Exponential backoff
          }
          return throwError(() => error);
        }
      })
    );
  }
}
```

---

## Integración con Interceptores

La utilidad ya está integrada en el `errorInterceptor`, por lo que todos los errores HTTP se manejan automáticamente. No necesitas usar `handleError` en cada servicio si quieres el comportamiento por defecto.

Sin embargo, puedes usar `handleError` cuando necesites:
- Mensajes de error personalizados
- Contexto adicional para debugging
- Lógica de error específica para ciertas operaciones

---

## Logging en Consola

Los errores se loguean automáticamente en consola con el siguiente formato:

```
🔴 Error [403] - 2025-01-16T10:30:45.123Z
  📍 Context: HTTP GET /api/users
  💬 Message: No tiene permisos para realizar esta acción.
  📊 Status: 403 Forbidden
  🔍 Original Error: [HttpErrorResponse object]
```

Para desactivar el logging:

```typescript
catchError(handleError({
  context: 'Silent operation',
  logToConsole: false
}))
```

---

## Mejores Prácticas

1. **Siempre proporciona contexto**: Ayuda al debugging
   ```typescript
   catchError(handleError({ context: 'User login' }))
   ```

2. **Usa mensajes personalizados cuando sea necesario**: Para mejorar UX
   ```typescript
   catchError(handleError({
     context: 'Delete user',
     customMessage: 'No se pudo eliminar el usuario. Intente nuevamente.'
   }))
   ```

3. **Maneja errores de validación específicamente**: Para mejor feedback al usuario
   ```typescript
   error: (error) => {
     const validationErrors = ErrorHandler.extractValidationErrors(error);
     // Mostrar errores en el formulario
   }
   ```

4. **Usa `createErrorCatcher` en try-catch**: Para consistencia
   ```typescript
   const errorCatcher = createErrorCatcher({ context: 'Parse JSON' });
   ```

5. **Verifica si el error es reintenteble**: Antes de implementar retry logic
   ```typescript
   if (ErrorHandler.isRetryable(error)) {
     // Retry logic
   }
   ```

---

## Migración de Código Existente

### Antes (sin ErrorHandler)

```typescript
getUsers(): Observable<User[]> {
  return this.http.get('/api/users').pipe(
    catchError((error) => {
      console.error('Error fetching users:', error);
      return throwError(() => error);
    })
  );
}
```

### Después (con ErrorHandler)

```typescript
getUsers(): Observable<User[]> {
  return this.http.get('/api/users').pipe(
    catchError(handleError({ context: 'Fetching users' }))
  );
}
```

---

## Notas Adicionales

- El `errorInterceptor` ya usa esta utilidad, por lo que los errores HTTP globales se manejan automáticamente
- Los mensajes de error se pueden personalizar según las necesidades del proyecto
- La utilidad es type-safe y funciona con TypeScript strict mode
- Compatible con Angular standalone components y servicios

---

## Soporte

Para más información o reportar problemas, consulta la documentación del proyecto.
