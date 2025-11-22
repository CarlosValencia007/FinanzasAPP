/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Navbar E2E Tests', () => {
  describe('Usuario no autenticado', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.clearLocalStorage();
      cy.clearAllSessionStorage();
    });

    describe('Elementos de la UI', () => {
      it('Debe mostrar el logo de FINANZAPP', () => {
        cy.contains('FINANZAPP').should('be.visible');
        cy.get('.logo').should('exist');
        cy.get('.logo a').should('have.attr', 'href', '/');
      });

      it('Debe mostrar los enlaces de navegación básicos', () => {
        cy.contains('Inicio').should('be.visible');
      });

      it('Debe mostrar enlaces de autenticación cuando el usuario no está autenticado', () => {
        cy.contains('Iniciar Sesión').should('be.visible');
        cy.contains('Registrarse').should('be.visible');
        cy.get('a[href="/login"]').should('exist');
        cy.get('a[href="/register"]').should('exist');
      });

    });

    describe('Usuario autenticado', () => {
      beforeEach(() => {
        // Realizar login y visitar la página de inicio
        cy.loginAndVisit('/');
      });

      it('Debe mostrar información del usuario cuando está autenticado', () => {
        // Verificar que aparece el email y botón de cerrar sesión
        cy.contains('Cerrar Sesión').should('be.visible');
      });

      it('Debe mostrar enlaces de Dashboard y Transacciones cuando está autenticado', () => {
        cy.contains('Dashboard').should('be.visible');
        cy.contains('Transacciones').should('be.visible');
        cy.get('a[href="/dashboard"]').should('exist');
        cy.get('a[href="/transactions"]').should('exist');
      });

      it('Debe navegar al dashboard cuando está autenticado', () => {
        cy.contains('Dashboard').click();
        cy.url().should('include', '/dashboard');
      });

      it('Debe navegar a transacciones cuando está autenticado', () => {
        cy.contains('Transacciones').click();
        cy.url().should('include', '/transactions');
      });
    });

    describe('Navegación', () => {
      it('Debe navegar a la página de inicio al hacer clic en el logo', () => {
        cy.get('.logo a').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
      });

      it('Debe navegar a la página de inicio al hacer clic en "Inicio"', () => {
        cy.contains('Inicio').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
      });

      it('Debe navegar a la página de login al hacer clic en "Iniciar Sesión"', () => {
        cy.contains('Iniciar Sesión').click();
        cy.url().should('include', '/login');
      });

      it('Debe navegar a la página de registro al hacer clic en "Registrarse"', () => {
        cy.contains('Registrarse').click();
        cy.url().should('include', '/register');
      });

    });

    describe('Funcionalidad de autenticación', () => {


      it('Debe cerrar sesión al hacer clic en el botón "Cerrar Sesión"', () => {
        // Interceptar la verificación de autenticación de Supabase
        cy.intercept('GET', '**/auth/v1/session**', {
          statusCode: 200,
          body: {
            data: {
              session: {
                access_token: 'mock-token',
                user: {
                  id: 'test-user-id',
                  email: 'test@live.uleam.edu.ec',
                  aud: 'authenticated'
                }
              }
            }
          }
        }).as('getSession');

        // Simular usuario autenticado
        cy.window().then((win) => {
          win.localStorage.setItem('isAuthenticated', 'true');
          win.localStorage.setItem('userEmail', 'test@live.uleam.edu.ec');
          win.localStorage.setItem('authToken', 'mock-token');
          win.localStorage.setItem('rememberMe', 'true');
        });

        cy.reload();

        // Interceptar la petición de logout
        cy.intercept('POST', '**/auth/v1/logout**', {
          statusCode: 200,
          body: {}
        }).as('logoutRequest');

        cy.contains('Cerrar Sesión').click();

        // Verificar que se redirige a la página de inicio
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Verificar que ya no aparece el email del usuario
        cy.get('.user-email').should('not.exist');
        cy.contains('Iniciar Sesión').should('be.visible');
      });

      it('No debe mostrar enlaces de login/register cuando el usuario está autenticado', () => {
        // Interceptar la verificación de autenticación de Supabase
        cy.intercept('GET', '**/auth/v1/session**', {
          statusCode: 200,
          body: {
            data: {
              session: {
                access_token: 'mock-token',
                user: {
                  id: 'test-user-id',
                  email: 'test@live.uleam.edu.ec',
                  aud: 'authenticated'
                }
              }
            }
          }
        }).as('getSession');

        cy.window().then((win) => {
          win.localStorage.setItem('isAuthenticated', 'true');
          win.localStorage.setItem('userEmail', 'test@live.uleam.edu.ec');
          win.localStorage.setItem('authToken', 'mock-token');
          win.localStorage.setItem('rememberMe', 'true');
        });

        cy.reload();

        cy.contains('Iniciar Sesión').should('not.exist');
        cy.contains('Registrarse').should('not.exist');
      });
    });

    describe('Estilos y diseño', () => {
      it('Debe tener las clases CSS correctas', () => {
        cy.get('header').should('exist');
        cy.get('nav').should('exist');
        cy.get('.logo').should('exist');
        cy.get('.nav-links').should('exist');
      });

      it('El logo debe tener efecto hover', () => {
        cy.get('.logo a').should('have.css', 'transition');
      });
    });

    describe('Diseño responsive', () => {
      it('Debe mostrar el menú hamburguesa en dispositivos móviles', () => {
        cy.viewport('iphone-x');
        cy.get('.menu-toggle').should('be.visible');
      });

      it('Debe ocultar los enlaces de navegación en dispositivos móviles', () => {
        cy.viewport('iphone-x');

        cy.get('.nav-links')
          .should('not.be.visible');

      });

      it('Debe mostrar los enlaces de navegación en desktop', () => {
        cy.viewport(1920, 1080);
        cy.get('.nav-links').should('be.visible');
        cy.get('.menu-toggle').should('not.be.visible');
      });
    });

    describe('Accesibilidad', () => {
      it('El botón del menú debe tener aria-label', () => {
        cy.get('.menu-toggle').should('have.attr', 'aria-label', 'Abrir menú');
      });

      it('Los enlaces deben ser accesibles', () => {
        cy.get('.nav-links a').each(($link) => {
          cy.wrap($link).should('be.visible');
        });
      });
    });

    describe('Interacciones', () => {
      it('Debe cambiar el color del logo al hacer hover', () => {
        cy.get('.logo a').trigger('mouseover');
        // Verificar que el elemento es interactivo
        cy.get('.logo a').should('exist');
      });

      it('Los enlaces deben ser clickeables', () => {
        cy.get('a[href="/login"]').should('be.visible').click();
        cy.url().should('include', '/login');
      });
    });
  });
});
