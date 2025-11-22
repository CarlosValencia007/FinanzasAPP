# Configuración de Pruebas E2E con Cypress

## Autenticación con Supabase

Este proyecto incluye comandos personalizados de Cypress para realizar autenticación real con Supabase.

### Configuración

1. **Configurar credenciales de prueba**

   **OPCIÓN 1: Usar archivo .env (RECOMENDADO)**

   Agrega las siguientes líneas a tu archivo `.env` en la raíz del proyecto:

   ```env
   TEST_USER_EMAIL=tu-email@live.uleam.edu.ec
   TEST_USER_PASSWORD=tu-contraseña
   ```

   Cypress cargará automáticamente estas variables desde el archivo `.env`.

   **OPCIÓN 2: Variables de entorno del sistema**

   ```powershell
   # Windows PowerShell
   $env:TEST_USER_EMAIL="tu-email@live.uleam.edu.ec"
   $env:TEST_USER_PASSWORD="tu-contraseña"
   ```

   ```cmd
   # Windows CMD
   set TEST_USER_EMAIL=tu-email@live.uleam.edu.ec
   set TEST_USER_PASSWORD=tu-contraseña
   ```

   ```bash
   # Linux/Mac
   export TEST_USER_EMAIL="tu-email@live.uleam.edu.ec"
   export TEST_USER_PASSWORD="tu-contraseña"
   ```

   ⚠️ **IMPORTANTE**: Asegúrate de que el archivo `.env` esté en `.gitignore` para no subir las credenciales al repositorio.

2. **Crear un usuario de prueba en Supabase**

   Asegúrate de tener un usuario de prueba creado en tu proyecto de Supabase con:
   - Email: debe terminar en `@live.uleam.edu.ec`
   - Contraseña: la que usarás en las pruebas

### Uso

#### Comando `cy.login()`

Realiza autenticación real con Supabase:

```typescript
beforeEach(() => {
  const email = Cypress.env('TEST_USER_EMAIL');
  const password = Cypress.env('TEST_USER_PASSWORD');
  
  cy.login(email, password, true); // true = guardar en localStorage
  cy.visit('/dashboard');
});
```

**Parámetros:**
- `email` (string): Correo electrónico del usuario
- `password` (string): Contraseña del usuario
- `rememberMe` (boolean, opcional): Si es `true`, guarda la sesión en localStorage. Por defecto: `true`

#### Comando `cy.logout()`

Cierra sesión limpiando el almacenamiento:

```typescript
afterEach(() => {
  cy.logout();
});
```

### Ejemplo Completo

```typescript
describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    const testEmail = Cypress.env('TEST_USER_EMAIL') || 'test@live.uleam.edu.ec';
    const testPassword = Cypress.env('TEST_USER_PASSWORD');

    if (!testPassword) {
      throw new Error('TEST_USER_PASSWORD no está configurada');
    }

    cy.login(testEmail, testPassword, true);
    cy.visit('/dashboard');
  });

  it('Debe cargar el dashboard', () => {
    cy.url().should('include', '/dashboard');
    cy.contains('Panel de Control').should('be.visible');
  });
});
```

### Solución de Problemas

#### Error: "Property 'login' does not exist"

Si ves este error en TypeScript, es probable que sea solo un problema del IDE. El código debería funcionar correctamente en tiempo de ejecución. Si persiste:

1. Reinicia el servidor de TypeScript en tu IDE
2. Verifica que `cypress/support/index.d.ts` existe
3. Asegúrate de que `cypress/support/e2e.ts` importa `./commands`

#### Error: "TEST_USER_PASSWORD no está configurada"

Configura la variable de entorno `TEST_USER_PASSWORD` antes de ejecutar las pruebas.

#### Error de autenticación

Verifica que:
- El usuario de prueba existe en Supabase
- Las credenciales son correctas
- El email termina en `@live.uleam.edu.ec`
- Las variables de entorno están configuradas correctamente

### Notas

- El comando `cy.login()` realiza una autenticación real con Supabase, no es un mock
- La sesión se guarda en el formato que Supabase espera
- Las pruebas requieren conexión a internet para autenticarse con Supabase

