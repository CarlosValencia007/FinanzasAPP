/// <reference types="cypress" />
/// <reference path="./index.d.ts" />

/**
 * Comando personalizado para iniciar sesión con Supabase
 * Realiza autenticación real usando la API de Supabase
 * 
 * @param email - Correo electrónico del usuario (debe ser @live.uleam.edu.ec)
 * @param password - Contraseña del usuario
 * @param rememberMe - Si es true, guarda la sesión en localStorage, si no en sessionStorage
 */
Cypress.Commands.add('login', (email: string, password: string, rememberMe: boolean = true) => {
  const supabaseUrl = Cypress.env('VITE_SUPABASE_URL') || 'https://iiqxgttmoxnxhjefnggw.supabase.co';
  const supabaseKey = Cypress.env('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcXhndHRtb3hueGhqZWZuZ2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTU2MDYsImV4cCI6MjA3NzE5MTYwNn0.xwquuyR5Qp18_tq8nk4zeo3RAhV_hrCQNiYMwclXtcM';

  // Extraer el project ref de la URL de Supabase
  // URL formato: https://{project-ref}.supabase.co
  const projectRef = supabaseUrl.split('//')[1].split('.')[0];

  // Realizar login usando la API REST de Supabase
  cy.request({
    method: 'POST',
    url: `${supabaseUrl}/auth/v1/token?grant_type=password`,
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
    },
    body: {
      email: email,
      password: password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('access_token');
    expect(response.body).to.have.property('user');

    const { access_token, refresh_token, expires_at, expires_in, token_type, user } = response.body;

    // Guardar la sesión en el almacenamiento según rememberMe
    cy.window().then((win) => {
      // Guardar datos personalizados de la aplicación
      if (rememberMe) {
        win.localStorage.setItem('isAuthenticated', 'true');
        win.localStorage.setItem('userEmail', user.email);
        win.localStorage.setItem('authToken', access_token);
        win.localStorage.setItem('rememberMe', 'true');
        win.localStorage.setItem('rememberEmail', user.email);
      } else {
        win.sessionStorage.setItem('isAuthenticated', 'true');
        win.sessionStorage.setItem('userEmail', user.email);
        win.sessionStorage.setItem('authToken', access_token);
      }

      // Guardar la sesión en el formato que Supabase espera
      // Supabase guarda la sesión en localStorage con una clave específica: sb-{project-ref}-auth-token
      const sessionData = {
        access_token: access_token,
        refresh_token: refresh_token || '',
        expires_at: expires_at || Math.floor(Date.now() / 1000) + (expires_in || 3600),
        expires_in: expires_in || 3600,
        token_type: token_type || 'bearer',
        user: user,
      };

      // Clave que Supabase usa para almacenar la sesión
      const supabaseStorageKey = `sb-${projectRef}-auth-token`;
      win.localStorage.setItem(supabaseStorageKey, JSON.stringify(sessionData));

      // También guardar en el formato que el cliente de Supabase espera
      // El cliente de Supabase también puede usar esta estructura
      win.localStorage.setItem(`sb-${projectRef}-auth-token-code-verifier`, '');
    });
  });
});

/**
 * Comando para cerrar sesión
 */
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});

/**
 * Comando helper que realiza login y visita una ruta específica
 * Útil para pruebas que requieren autenticación y redirección
 * 
 * @param route - Ruta a visitar después del login (ej: '/dashboard', '/transactions')
 * @param email - Correo electrónico (opcional, usa TEST_USER_EMAIL por defecto)
 * @param password - Contraseña (opcional, usa TEST_USER_PASSWORD por defecto)
 * @param rememberMe - Si es true, guarda la sesión en localStorage (por defecto: true)
 * @example
 * cy.loginAndVisit('/dashboard')
 * cy.loginAndVisit('/transactions', 'custom@email.com', 'password')
 */
Cypress.Commands.add('loginAndVisit', (route: string, email?: string, password?: string, rememberMe: boolean = true) => {
  const testEmail = email || Cypress.env('TEST_USER_EMAIL') || 'test@live.uleam.edu.ec';
  const testPassword = password || Cypress.env('TEST_USER_PASSWORD');

  if (!testPassword) {
    throw new Error(
      'TEST_USER_PASSWORD no está configurada. ' +
      'Por favor, configura las credenciales de prueba en .env o como variable de entorno.'
    );
  }

  // Validar que la ruta no sea login o register
  if (route === '/login' || route === '/register') {
    throw new Error(
      `La ruta "${route}" no está permitida. ` +
      'Usa una ruta autenticada como /dashboard, /transactions, o /'
    );
  }

  // Realizar login
  cy.login(testEmail, testPassword, rememberMe);

  // Visitar la ruta especificada
  cy.visit(route);
});